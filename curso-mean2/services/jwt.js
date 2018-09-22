'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');

var secret = "clave_secreta";

function createToken(user){
    var payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        mail: user.email,
        rol: user.rol,
        image:user.image,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix
    };

    return jwt.encode(payload, secret);
}

module.exports = {
    createToken
}