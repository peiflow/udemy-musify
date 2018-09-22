'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');
var chalk = require('chalk');
var jwt = require('../services/jwt');

var Artist = require('../models/artist');
var Song = require('../models/song');
var Album = require('../models/album');

function getArtist(req, res){
    var artistId = req.params.id;
    Artist.findById(artistId, (err, artist)=>{
        if(err){
            res.status(500).send({message:'Request error'});
        }else{
            if(!artist){
                res.status(404).send({message:'Artist not found'});
            }else{
                res.status(200).send({artist});
            }
        }
    });
}

function saveArtist(req, res){
    var artist = new Artist();
    var params = req.body;

    artist.name = params.name;
    artist.description = params.description;
    artist.image = null;

    artist.save((err, artistStored)=>{
        if(err){
            res.status(500).send({message:'Error while saving the artist'});
        }else{
            if(artistStored){
                res.status(200).send({message:'Artist saved!', artist:artist});
            }else{
                res.status(404).send({message:'Artist is not registered'});
            }
        }
    });
}

function getArtists(req, res)
{
    
    var page = (req.params.page) ? req.params.page : 1;
    var itemsPerPage = 3;

    Artist.find().sort('name').paginate(page, itemsPerPage, (err, artists, total)=>{
        if(err){
            res.status(500).send({message:'Request error'});
        }else{
            if(!artists){
                res.status(404).send({message:'Artists not found'});
            }else{
                return res.status(200).send({
                    total:total,
                    artists:artists
                });
            }
        }
    });
}

function upadateArtist(req, res)
{
    var artistId = req.params.id;
    var update = req.body;

    Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated)=>{
        if(err){
            res.status(500).send({message:'Error while updating'});
        }else{
            if(!artistUpdated){
                res.status(404).send({message: 'The artist has not been updated'});
            }else{
                res.status(200).send({artist: artistUpdated});
            }
        }
    });
}

function deleteArtist(req, res){
    var id = req.params.id;
    Artist.findByIdAndRemove(id, (err, artistRemoved)=>{
        if(err){
            res.status(500).send({message:'Error while deleting artist'});
        }else{
            if(!artistRemoved){
                res.status(404).send({message: 'The artist has not been removed'});
            }else{
                //Elimina los albums del artista
                Album.find({artist:artistRemoved.id}).remove((err, albumRemoved)=>{
                    if(err){
                        res.status(500).send({message:'Error while deleting album'});
                    }else{
                        if(!artistRemoved){
                            res.status(404).send({message: 'The album has not been removed'});
                        }else{
                            //Elimina las canciones asociadas al album
                            Song.find({album:albumRemoved.id}).remove((err, songRemoved)=>{
                                if(err){
                                    res.status(500).send({message:'Error while deleting song'});
                                }else{
                                    if(!artistRemoved){
                                        res.status(404).send({message: 'The song has not been removed'});
                                    }else{
                                        res.status(200).send({message: 'Artist removed!'});
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    });
}

function uploadImage(req, res){
    var artistId = req.params.id;
    var file_name = "";

    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var file_split = file_name.split('\.');
        var file_ext = file_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif' ){
            Artist.findByIdAndUpdate(artistId, {
                image: file_name
            },
            (err, artistUpdated)=>{
                if(err){
                    res.status(500).send({message: 'Error while updating artist'});
                }else{
                    if(!artistUpdated){
                        res.status(404).send({message: 'Can not find artist'});
                    }else{
                        res.status(500).send({artist: artistUpdated});
                    }
                }
            });
        }else{
            res.status(200).send({message: 'Invalid image extension'});
        }

        console.log(chalk.magenta(file_name));
    }else{
        res.status(200).send({message: 'Image not uploaded'});
    }
}

function getImageFile(req, res)
{
    var imageFile = req.params.imageFile;
    var pathFile = './uploads/artists/' + imageFile;
    fs.exists((pathFile), (exists)=>{
        if(exists){
            res.sendFile(path.resolve(pathFile));
        }else{
            res.status(404).send({message: 'Image not found'});
        }
    });
}

module.exports ={
    getArtist,
    saveArtist,
    getArtists,
    upadateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
}
