'use strict'

var express = require('express');
var bodyParser = require('body-parser');

//nueva instancia de express
var app = express();

//cargar rutas
var user_routes = require('./routes/user');


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//configurar cabeceras

//rutas base
app.use('/api', user_routes);


module.exports = app;