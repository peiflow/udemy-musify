'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');
var chalk = require('chalk');
var jwt = require('../services/jwt');

var Artist = require('../models/artist');
var Song = require('../models/song');
var Album = require('../models/album');

function getAlbum(req, res){
    var albumId = req.params.id;

    Album.findById(albumId).populate({path:'artist'}).exec((err, album)=>{
        if(err){
            res.status(500).send({message: "Server error"});
        }else{
            if(!album){
                res.status(404).send({message: "Album doesn´t exists"});
            }else{
                res.status(200).send({album});
            }
        }
    });
}

function getAlbums(req, res){
    var artistId = req.params.artist;

    if(!artistId){
        var find = Album.find({}).sort('title');
    }else{
        var find = Album.find({artist:artistId}).sort('year');
    }

    find.populate({path:'artist'}).exec((err, albums)=>{
        if(err){
            res.status(500).send({message: "Server error"});
        }else{
            if(!albums){
                res.status(404).send({message: "There are no albums in the database"});
            }else{
                res.status(200).send({albums});
            }
        }
    });
}

function saveAlbum(req, res){
    var album = new Album();
    var params = req.body;

    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = null;
    album.artist = params.artist;

    album.save(album, (err, albumStored)=>{
        if(err){
            res.status(500).send({message: "Server error"});
        }else{
            if(!albumStored){
                res.status(404).send({message: "Album has been not saved"});
            }else{
                res.status(200).send({albumStored});
            }
        }
    });
}


function updateAlbum(req, res){
    var albumId = req.params.id;
    var update = req.body;

    Album.findByIdAndUpdate(albumId, update, (err, albumUpdated)=>{
        if(err){
            res.status(500).send({message: "Server error"});
        }else{
            if(!albumUpdated){
                res.status(404).send({message: "Album has been not updated"});
            }else{
                res.status(200).send({albumUpdated});
            }
        }
    });
}

function deleteAlbum(req, res){
    var albumId = req.params.id;
    Album.findByIdAndRemove(albumId, (err, albumRemoved)=>{
        if(err){
            res.status(500).send({message:'Error while deleting album'});
        }else{
            if(!albumRemoved){
                res.status(404).send({message: 'The album has not been removed'});
            }else{
                //Elimina las canciones asociadas al album
                Song.find({album:albumRemoved.id}).remove((err, songRemoved)=>{
                    if(err){
                        res.status(500).send({message:'Error while deleting song'});
                    }else{
                        if(!albumRemoved){
                            res.status(404).send({message: 'The song has not been removed'});
                        }else{
                            res.status(200).send({albumRemoved});
                        }
                    }
                });
            }
        }
    });
}

function uploadImage(req, res){
    var albumId = req.params.id;
    var file_name = "";

    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var file_split = file_name.split('\.');
        var file_ext = file_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif' ){
            Album.findByIdAndUpdate(albumId, {
                image: file_name
            },
            (err, artistUpdated)=>{
                if(err){
                    res.status(500).send({message: 'Error while updating album'});
                }else{
                    if(!artistUpdated){
                        res.status(404).send({message: 'Can not find album'});
                    }else{
                        res.status(200).send({artistUpdated});
                    }
                }
            });
        }else{
            res.status(200).send({message: 'Invalid image extension'});
        }

        console.log(chalk.magenta(file_name));
    }else{
        res.status(500).send({message: 'Image not uploaded'});
    }
}

function getImageFile(req, res)
{
    var imageFile = req.params.imageFile;
    var pathFile = './uploads/albums/' + imageFile;
    fs.exists((pathFile), (exists)=>{
        if(exists){
            res.sendFile(path.resolve(pathFile));
        }else{
            res.status(404).send({message: 'Image not found'});
        }
    });
}

module.exports = {
    saveAlbum,
    getAlbum,
    getAlbums,    
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
}