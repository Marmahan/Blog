const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const axios = require('axios');
var cors = require('cors');         //to handle cors error !!! required in all services



const Service = require('../servicesdb/Service');//content trust
const Relation = require('../servicesdb/Relation');//content trust

//creating the server
const app = express();
app.use(cors());

//connect to mongodb
mongoose.connect('mongodb://localhost/trust',{ useNewUrlParser: true });
mongoose.Promise = global.Promise;

//so the app can handle json requests
app.use(bodyParser.json());


app.post('/contenttrustevaluate', function(req,res){
    //store services names and ports
    var svs= new Array();
    var sdata= new Array();
    var selfPort=req.body.reqPort;// the port of the requestor service so it can recognize its direct trust
    var nOfServices=7;//no. of services - 1
    var indexes= new Array();
    var index=-1;
    var isTrustSufficient=false;
    var nOfAttempts=0;
    var allAttempts=false;
    var evaluate=0;
    var trust=0;
    var notZeroTrust=0;//to calculate how many trusts are not zero so divide the overall over this number
    var finalevaluation=0;
    var sTrustIndex=-1;

    Service.find({name: req.body.serviceName }).then( services =>{

        if(!services)
            {
                console.log(services)
                res.status(402).send('No Service found');
            }
        else
            {
                //stores all the names and ports for services that have the name "duplication"
                for( var i in services){
                    svs.push({port:services[i].port,name:services[i].name});
                }

                //console.log(services.length)
                //res.json(services);
                //console.log('first');
            }

        })
        .then( ()=>{
            var tmp=Math.floor(Math.random() * svs.length);//choose a service randomly
            index=tmp;
            //evaluate++;//how many evaluations
            //get the data of the service from the Service collection
            Service.findOne({port: svs[index].port}).then( data => {
                if(!data)
                    {
                        res.status(402).send('Error retrieving the rest of the data');
                    }
                else{//store the data in an array
                        sdata.push({_id:data._id,name:data.name, port:data.port, source:data.source,
                        sensitivity:data.sensitivity, startdate:data.startdate, 
                        lastsuccess:data.lastsuccess, interactions:data.interactions, 
                        successful:data.successful, failed:data.failed});
                        //console.log(sdata);
                        //console.log('second');
                    }
            }).then( ()=>{
                Relation.findOne({sid:sdata[0]._id}).then( retn =>{
                    if(!retn)
                        {
                            res.status(402).send('Error retrieving the relation data');
                        }
                    else{   //store the values of trust in the Relation into the array
                            var v=0,c=0;
                            for(v=0;v< retn.services.length;v++){
                                var key="trust"+c;
                                if(retn.services[v].port==selfPort)//if the port matchs the port of the service 
                                    {
                                        key="strust"; //then this is the direct trust value
                                        sTrustIndex=v;//send the index of the direct trust/self-trust
                                    }
                                else
                                    c++;
                                sdata.push({[key]:retn.services[v].trust})
                            }
                        }
                }).then(()=>{//now the data is not organized well
                    acc={} //store everything as a single object in the array of objects
                    acc=sdata.reduce( function(acc, x) {
                       for (var key in x) acc[key] = x[key];
                       return acc;
                   }, {});
               
                  console.log(acc);
                  //console.log('third');
                }).then(()=>{//calculate trust evaluation
                    if(acc.source=='in')
                        trust=trust+10;
                    else
                        trust = trust +5;
                    //console.log(trust);

                    //mainpulate the trust value depending on the difference
                    var difference=0;
                    difference=acc.successful-acc.failed;

                    if(difference<0)
                        trust-=5;
                    else if(difference>0 && difference<4)
                        trust+=2;
                    else if(difference>3 && difference<7)
                        trust+=2;
                    else if(difference>7 && difference < 11)
                        trust+=2;
                    else if(difference>10)
                        trust+=5;

                    //console.log(trust);

                    //number of services (including self-trust)
                    var tmptrust=0;

                    tmptrust=parseInt(acc.strust);//*2
                    if(tmptrust)
                        notZeroTrust++;
                    trust=trust+tmptrust;
                    tmptrust=0;
                    
                    tmptrust=parseInt(acc.trust0);
                    if(tmptrust)
                        notZeroTrust++;
                    trust=trust+tmptrust;
                    tmptrust=0;

                    tmptrust=parseInt(acc.trust1);
                    if(tmptrust)
                        notZeroTrust++;
                    trust=trust+tmptrust;
                    tmptrust=0;

                    tmptrust=parseInt(acc.trust2);
                    if(tmptrust)
                        notZeroTrust++;
                    trust=trust+tmptrust;
                    tmptrust=0;

                    tmptrust=parseInt(acc.trust3);
                    if(tmptrust)
                        notZeroTrust++;
                    trust=trust+tmptrust;
                    tmptrust=0;

                    tmptrust=parseInt(acc.trust4);
                    if(tmptrust)
                        notZeroTrust++;
                    trust=trust+tmptrust;
                    tmptrust=0;

                    tmptrust=parseInt(acc.trust5);
                    if(tmptrust)
                        notZeroTrust++;
                    trust=trust+tmptrust;
                    tmptrust=0;

                    //divide the final trust by the trusts that are not zero
                    finalevaluation=trust/notZeroTrust;

                    console.log('sum of trust is ' + trust);
                    console.log('final evaluation ' + finalevaluation);

                    if((finalevaluation)>10)
                        trust=10;
                    else if ((finalevaluation)<0)
                        trust = 0;
                    else
                        trust=Math.floor(finalevaluation);

                    //trust evaluation according to sensitivity
                    switch(acc.sensitivity){
                        case 'h':
                            if(trust>6)
                                isTrustSufficient=true;
                            break;
                        case 'm':
                            if(trust>3 && trust<7)
                                isTrustSufficient=true;
                            break;
                        case 'l':
                            if(trust>0 && trust<4)
                                isTrustSufficient=true;
                            break;
                    }

                    console.log('strust index is ' + sTrustIndex);
                    //send the port number to refer to successful evaluation
                    //also send trust, interactions+1, successful+1, id
                    if(isTrustSufficient){
                        console.log(trust);
                        //store the values to send them in the response
                        var finalresponse=[];
                         finalresponse.push({port:acc.port.toString(),trust:trust.toString(),
                            interactions:acc.interactions.toString(),successful:acc.successful.toString(),
                            trustIndex:sTrustIndex.toString()});
                        //send the response    
                        res.send(finalresponse);

                    }
                    else
                        {
                            console.log(trust);
                            res.send('failed' + acc.port.toString()+'t'+trust+';');
                        }
                })
            })

    }) 
     .catch(err => {
         //when the service is not part of the list of services
         res.send('Service is not available');
     });
}) 


var reqPort=0;
app.post('/evaluate', function(req,res){

    reqPort:req.body.reqPort;//get the port of the requesting service
    var results=new Array();
    var resulttrusts=new Array();
    
    //5 refers to the number of tries
    request(5, (data, error) => {
        // consume data
        if (error) {
            res.send(error);
            return;
        }
        //console.log(data.data);
    });

    function request( retries,  callback) {
        axios.post('http://localhost:2000/contenttrustevaluate', {
            serviceName: req.body.serviceName,//name of the required service
            reqPort: req.body.reqPort        //port of the requestor
        }).then(response => {
            //success, result doesn't have f in it
            //it only contains the port number
            if(!response.data.toString().includes('failed')) {
                //should save the trust values back to the database
                //here
                var portvalue = response.data[0].port;
                var trustvalue = response.data[0].trust;
                var interactionsvalue = parseInt(response.data[0].interactions)+1;
                var successfullvalue = parseInt(response.data[0].successful)+1;
                var directtrustindex = response.data[0].trustIndex;

                console.log('port value is '+portvalue);
                console.log('trust value is '+trustvalue);
                console.log('interactions value is '+interactionsvalue);
                console.log('successfull value is '+successfullvalue);
                console.log('directtrustindex value is '+directtrustindex);

                //update the Service collection
                //new values for interactions,...
                Service.findOneAndUpdate({port: portvalue }, 
                    { lastsuccess: new Date().toString(), interactions: interactionsvalue,
                    successful: successfullvalue },
                    { new: true, useFindAndModify: false })
                    .then((updated)=>{
                    console.log("Successfuly updated")
                }).catch((err)=>{
                    console.log(err);
                })

                //Update the direct trust
                 Relation.findOneAndUpdate({port: portvalue, 'services.port':'1116' }, 
                 {'$set': {
                    'services.$.trust': trustvalue.toString()
                }}, { new: true, useFindAndModify: false }).then(()=>{
                    console.log('direct trust updated');
                }).catch((err)=>{
                    console.log(err);
                })

                res.send(portvalue.toString());
            }


            else {//failed try so get the values and store them in the array
                //extract the trust value
                var trustvalue = response.data.toString().substring(
                    response.data.toString().lastIndexOf("t") + 1, 
                    response.data.toString().lastIndexOf(";")
                );
                //extract the port value
                var portvalue = response.data.toString().substring(
                    response.data.toString().lastIndexOf("d") + 1, 
                    response.data.toString().lastIndexOf("t")
                );
                //store all the failed values in the array
                //so if all tries failed, the highest value is sent back 
                results.push({port:portvalue, trust:trustvalue});
                console.log(results);

                if (retries > 0) {
                    request(--retries, callback);
                }
                //should send the highest value out of failed attempts
                else {
                        //parse the values of the result into integer
                        //so we can extract the highest trust
                        results.forEach(function (arrayItem) {
                            resulttrusts.push(parseInt(arrayItem.trust));
                        });
                        console.log(resulttrusts)
                        //get the index of max value
                        var indexOfMaxValue = resulttrusts.indexOf(Math.max(...resulttrusts));
                        console.log(results[indexOfMaxValue].port);
                        //should store the trust values back to the database
                        callback([], "Not enough trust but best possible is "+ results[indexOfMaxValue].port);  
                    }
            }
        })
        .catch((error) => {
            console.log(error);
            res.send('Service was not found');
          });
    }

});

//Service is listening to port 2000
app.listen(2000, function(){
    console.log("Service: (CT port 2000) is running...");
});

// {
//     "serviceName": "duplication"
// }