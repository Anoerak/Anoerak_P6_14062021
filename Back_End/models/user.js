const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    //permet de n'utiliser qu'une seule fois l'adresse email
    email: { type: String, required: true, unique: 'Cette adresse email ({VALUE}) possède déjà un compte utilisateur.'},
    password: { type: String, required: true}
    });

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('user', userSchema);