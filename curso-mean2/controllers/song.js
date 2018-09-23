'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');
var chalk = require('chalk');
var jwt = require('../services/jwt');

var Artist = require('../models/artist');
var Song = require('../models/song');
var Album = require('../models/album');

function saveSong(req, res) {
    var song = new Song();
    var params = req.body;

    song.name = params.name;
    song.number= params.number;
    song.duration = params.duration;
    song.file = null;
    song.album = params.album;

    song.save((err, songSaved)=>{
        if(err){
            res.status(500).send({message:'Server error'});
        }else{
            if(songSaved){
                res.status(200).send({message:'Song saved!', songSaved});
            }else{
                res.status(404).send({message:'Song has been not saved'});
            }
        }
    });

}

function getSong(req, res){
    var songId = req.params.id;
    
    Song.findById(songId).populate({path:'album'}).exec((err, song)=>{
        if(err){
            res.status(500).send({message:'Server error'});
        }else{
            if(song){
                res.status(200).send({song});
            }else{
                res.status(404).send({message:'Song not found'});
            }
        }
    });
}

function getSongs(req, res){
    var albumId = req.params.id;

    if(albumId){
        var find = Song.find({album:albumId}).sort('number');
    }else{
        var find = Song.find({}).sort('name');
    }   

    find.populate({
        path: 'album',
        populate:{
            path:'artist',
            model: 'Artist'
        }
    }).exec((err, songs)=>{
        if(err){
            res.status(500).send({message:'Server error'});
        }else{
            if(songs){
                res.status(200).send({songs});
            }else{
                res.status(404).send({message:'Songs not found'});
            }
        }
    });
}

function updateSong(req, res){
    var songId = req.params.id;
    var update = req.body;

    Song.findByIdAndUpdate(songId, update, (err, songUpdated)=>{
        if(err){
            res.status(500).send({message:'Server error'});
        }else{
            if(songUpdated){
                res.status(200).send({songUpdated});
            }else{
                res.status(404).send({message:'Song not updated'});
            }
        }
    });
}

function deleteSong(req, res){
    var songId = req.params.id;

    Song.findByIdAndRemove(songId, (err, songDeleted)=>{
        if(err){
            res.status(500).send({message:'Error while deleting song'});
        }else{
            if(!songDeleted){
                res.status(404).send({message: 'The song has not been removed'});
            }else{
                res.status(200).send({songDeleted});
            }
        }
    });
}

module.exports = {
    saveSong,
    getSong,
    getSongs,
    updateSong,
    deleteSong
}