const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Service = require('./Service');


//creating the server
const app = express();

mongoose.connect('mongodb://localhost/trust',{ useNewUrlParser: true });
mongoose.Promise = global.Promise;

//so the app can handle json requests
app.use(bodyParser.json());


//old way with no services from outside
//post request to save a new user
app.post('/newservice', function(req,res){

    var newService ={
        name: req.body.name,
        port: req.body.port,
        source: req.body.source,
        sensitivity: req.body.sensitivity,
        startdate: req.body.startdate,
        lastsuccess: req.body.lastsuccess,
        interactions: req.body.interactions,
        successful: req.body.successful,
        failed: req.body.failed

    }
    var service = new Service (newService);
    service.save().then(function(){
        res.send('1');
    }).catch(function(err){
        if(err)
            throw err;
    });  

});


//Service is listening to port 1111
app.listen(1500, function(){
    console.log("Service: (Add service, listening to 1500) is running...");
});
/*
{
    "name":"posts",
    "port":"1115",
    "source":"in",
    "sensitivity":"m",
    "startdate":"2019-01-15",
    "lastsuccess":"2019-01-20",
    "interactions":"5",
    "successful":"4",
    "failed":"1"
}
*/