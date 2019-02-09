const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Relation = require('./Relation');


//creating the server
const app = express();

mongoose.connect('mongodb://localhost/trust',{ useNewUrlParser: true });
mongoose.Promise = global.Promise;

//so the app can handle json requests
app.use(bodyParser.json());


//old way with no services from outside
//post request to save a new user
app.post('/newrelation', function(req,res){

    var newRelation ={
        name: req.body.name,
        port: req.body.port,
        sid: req.body.sid,
        services: req.body.services
    }
    var relation = new Relation (newRelation);
    relation.save().then(function(){
        res.send('1');
    }).catch(function(err){
        if(err)
            throw err;
    });  

});


//Service is listening to port 1111
app.listen(1501, function(){
    console.log("Service: (Add Relation, listening to 1501) is running...");
});
/*

{
    "name":"posts",
    "port":"1115",
    "sid":"5c40a59e8e87d723eccefb3f",
    "services":[{"port":"1119", "trust":"4"},{"port":"1125", "trust":"7"},{"port":"1126", "trust":"1"}, {"port":"1118", "trust":"2"}, {"port":"1127", "trust":"8"}, {"port":"1128", "trust":"5"}]
}

{
    "name":"validation",
    "sid":"5c5898a6cf7229286499c746",
    "services":[{"port":"1119", "trust":"0"},{"port":"1116", "trust":"7"},{"port":"2119", "trust":"1"}, {"port":"1115", "trust":"6"}, {"port":"2118", "trust":"0"}, {"port":"2121", "trust":"1"}, {"port":"2120", "trust":"0"}]
}

*/