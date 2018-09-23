'use strict'

var express = require('express');
var albumController = require('../controllers/album');
var md_auth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');
var api = express.Router();

var md_upload = multipart({
    uploadDir: './uploads/albums'
});

api.get('/album/:id', md_auth.ensureAuth, albumController.getAlbum);
api.get('/albums/:artist?', md_auth.ensureAuth, albumController.getAlbums);
api.post('/album', md_auth.ensureAuth, albumController.saveAlbum);
api.put('/album/:id', md_auth.ensureAuth, albumController.updateAlbum);
api.delete('/album/:id', md_auth.ensureAuth, albumController.deleteAlbum);
api.post('/upload-image-album/:id', [md_auth.ensureAuth, md_upload], albumController.uploadImage);
api.get('/get-image-album/:imageFile', albumController.getImageFile);

module.exports = api;