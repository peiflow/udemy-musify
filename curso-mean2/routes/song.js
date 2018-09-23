'use strict'

var express = require('express');
var songController = require('../controllers/song');
var md_auth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');
var api = express.Router();

var md_upload = multipart({
    uploadDir: './uploads/songs'
});

api.get('/song/:id', md_auth.ensureAuth, songController.getSong);
api.get('/songs/:page?', md_auth.ensureAuth, songController.getSongs);
api.post('/song', md_auth.ensureAuth, songController.saveSong);
api.put('/song/:id', md_auth.ensureAuth, songController.updateSong);
api.delete('/song/:id', md_auth.ensureAuth, songController.deleteSong);
api.post('/upload-song-file/:id', [md_auth.ensureAuth, md_upload], songController.uploadFile);
api.get('/get-song-file/:songFile', songController.getSongFile);


module.exports = api;