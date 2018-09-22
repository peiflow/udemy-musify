'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var chalk = require('chalk');
var secret = "clave_secreta";

function ensureAuth(req, res, next){
    console.log(chalk.yellow(req.headers.authorization));
    if(!req.headers.authorization){
        return res.status(403).send({
            message:"Request doesn´t have authentication header"
        });
    }

    var token = req.headers.authorization.replace(/['"]+/g, '');

    try{
        var payload = jwt.decode(token, secret);

        if(payload.exp <= moment().unix()){
            return res.status(401).send({message:'Expired token'});    
        }
    }catch(err){
        console.log(chalk.red(err));
        return res.status(404).send({message:'Invalid token'});
    }

    req.user = payload;

    next();
}

module.exports={
    ensureAuth
}