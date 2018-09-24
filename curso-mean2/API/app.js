'use strict'

var express = require('express');
var bodyParser = require('body-parser');

//nueva instancia de express
var app = express();

//cargar rutas
var user_routes = require('./routes/user');
var artist_routes = require('./routes/artist');
var album_routes = require('./routes/album');
var song_routes = require('./routes/song');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json({limit: '10mb', extended:true}));

//configurar cabeceras
app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization', 'X-API-KEY, Origin, X-Requesterd-With, Content-Type, Accept, Access-Control-Request-Method');
    res.header('Access-Control-Allow-Method', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Allow', 'GET, POST, PUT, DELETE, OPTIONS');

    next();
});


//rutas base
app.use('/api', user_routes);
app.use('/api', artist_routes);
app.use('/api', album_routes);
app.use('/api', song_routes);



module.exports = app;