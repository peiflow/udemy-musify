'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var chalk = require('chalk');
var User = require('../models/user');
var jwt = require('../services/jwt');

function pruebas(req, res){
    res.status(200).send({
        "message":"Testing an user controller action"
    });
}

function saveUser(req, res){
    var user = new User();
   
    var params = req.body;

    console.log(params);

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.rol = params.rol;
    user.image = null;

    if(params.password){
        bcrypt.hash(params.password, null, null, (err,hash)=>{
            user.password = hash;
            if(user.name != null && user.surname != null && user.email != null){
                user.save((err,userStored)=>{
                    if(!err){
                        if(!userStored){
                            res.status(404).send({message:'User is not registered'});
                        }else{
                            console.log(chalk.yellow('Saved'));
                            res.status(200).send({message:'Saved!', user: userStored});
                        }
                    }else{
                        res.status(500).send({message:'Error while saving the user'});
                    }
                });
            }else{
                res.status(200).send({message:'All fields must be completed'});
            }
        });
    }else{
        res.status(200).send({message:'Insert the password'});
    }
}

function loginUser(req, res)
{
    var params = req.body;
    console.log({"req":params});
    var email = params.email;
    var password = params.password;

    User.findOne({email: email.toLowerCase()}, (err, user)=>{
        if(err){
            res.status(500).send({message:'Request error'});
        }else{
            if(!user){
                res.status(404).send({message:'User does not exists'});
            }else{
                bcrypt.compare(password, user.password, (err, check)=>{
                    if(check){                    
                        if(params.gethash){
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });
                            console.log({"Token":jwt.createToken(user)});
                        }else{
                            console.log({"res":user});
                            res.status(200).send({user});
                        }
                    }else{
                        res.status(404).send({message:'Login failure'});
                    }
                });
            }
        }
    });
}

function updateUser(req, res){
    var userId = req.params.id;
    var update = req.body;

    if(userId != req.user.sub){
        return res.status(500).send({message:'Action denied', 'params.id':userId, 'req.user':req.user.sub});        
    }
    User.findByIdAndUpdate(userId, update, (err, userUpdated)=>{
        if(err){
            res.status(500).send({message: 'Error while updating user', error:err});
        }else{
            if(!userUpdated){
                res.status(404).send({message: 'Can not find user'});
            }else{
                res.status(200).send({user: userUpdated});
            }
        }
    });
}

function uploadImage(req, res){
    var userId = req.params.id;
    var file_name = '';

    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var file_split = file_name.split('\.');
        var file_ext = file_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif' ){
            User.findByIdAndUpdate(userId, {
                image: file_name
            },
            (err, userUpdated)=>{
                if(err){
                    res.status(500).send({message: 'Error while updating user'});
                }else{
                    if(!userUpdated){
                        res.status(404).send({message: 'Can not find user'});
                    }else{
                        res.status(500).send({user: userUpdated, image: file_name});
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
    var pathFile = './uploads/users/'+imageFile;
    fs.exists((pathFile), (exists)=>{
        if(exists){
            res.sendFile(path.resolve(pathFile));
        }else{
            res.status(404).send({message: 'Image not found'});
        }
    });
}

module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
};