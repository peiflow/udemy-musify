'use strict'
var bcrypt = require('bcrypt-nodejs');
var chalk = require('chalk');
var User = require('../models/user');

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
    user.rol = 'ROL_ADMIN';
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
    console.log(params);
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
                    if(check)
                    {
                        if(params.gethash){

                        }else{
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

module.exports = {
    pruebas,
    saveUser,
    loginUser
};