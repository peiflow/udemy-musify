'use strict'

var express = require('express');
var bodyParser = require('body-parser');

//nueva instancia de express
var app = express();

//cargar rutas
var user_routes = require('./routes/user');
var artist_routes = require('./routes/artist');


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json({limit: '10mb', extended:true}));

//configurar cabeceras

//rutas base
app.use('/api', user_routes);
app.use('/api', artist_routes);


module.exports = app;