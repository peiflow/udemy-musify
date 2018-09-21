'use strict'

var mongoose = require('mongoose');
var chalk = require('chalk');
var app = require('./app');
var port = process.env.PORT || 3977;

//Conexión con bbdd
//no tiene en cuenta /curso_mean2, puede no estar creado
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/curso_mean2', { useNewUrlParser: true }, (err, res) => 
{
    if(err){
        throw(err);
    }else{
        console.log(chalk.blue("Database connection is running"));

        app.listen(port, ()=>{
            console.log(chalk.blue("API's server listening on http://localhost:"+port));
        });
    }
});