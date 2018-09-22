'use strict'

var express = require('express');
var artistController = require('../controllers/artist');
var md_auth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');
var api = express.Router();

var md_upload = multipart({
    uploadDir: './uploads/artists'
});


api.get('/artist/:id', md_auth.ensureAuth, artistController.getArtist);
api.get('/artists/:page?', md_auth.ensureAuth, artistController.getArtists);
api.post('/artist', md_auth.ensureAuth, artistController.saveArtist);
api.put('/artist/:id', md_auth.ensureAuth, artistController.upadateArtist);
api.delete('/artist/:id', md_auth.ensureAuth, artistController.deleteArtist);
api.post('/upload-image-artist/:id', [md_auth.ensureAuth, md_upload], artistController.uploadImage);
api.get('/get-image-artist/:imageFile', [md_auth.ensureAuth, md_upload], artistController.getImageFile);


module.exports = api;