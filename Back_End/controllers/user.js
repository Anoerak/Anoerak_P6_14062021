const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
var mongoMask = require('mongo-mask');
const crypto = require('crypto');
const regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;



exports.signup = (req, res, next) => {
    if (!regex.test(req.body.password)) {
        return res.status(400).json({error:'Votre mot de passe doit contenir au moins 12 caractères dont 1 minuscule, 1 majuscule, 1 chiffre et 1 caractère spécial'})
    } else {
        bcrypt.hash(req.body.password, 10)
        .then(hash => {
            key = "Setback_!&%Lunchroom_!&%Guide_!&%Twisting_!&%Gravity_!&%Lively";
            cipher = crypto.createCipher('aes192', key)
            cipher.update(req.body.email, 'binary', 'hex')
            encodedString = cipher.final('hex')
            const user = new User({
                email: encodedString,
                password: hash
            });
            user.save()
            .then(() => res.status(201).json({message: 'Utilisateur Enregistré !'}))
            .catch(error => res.status(400).json(error.errors['email'].message))
        })
        .catch(error => res.status(500).json({ error }));
    }
};

exports.login = (req, res, next) => {
    key = "Setback_!&%Lunchroom_!&%Guide_!&%Twisting_!&%Gravity_!&%Lively";
      cipher = crypto.createCipher('aes192', key)
      cipher.update(req.body.email, 'binary', 'hex')
      encodedString = cipher.final('hex')
    User.findOne({ email: encodedString})
    .then(user => {
        if (!user) {
            return res.status(401).json({ error });            
        }
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if(!valid){
                return res.status(401).json({ message: 'Mot de Passe incorrect' });   
            }
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    { userId: user._id},
                    'Setback_!&%Lunchroom_!&%Guide_!&%Twisting_!&%Gravity_!&%Lively',
                    { expiresIn: '24h'}
                )
            });
        })
        .catch(error => res.status(500).json({ message: 'Adresse email non reconnue' }));
    })
    .catch(error => res.status(500).json({ message: 'Adresse email non reconnue' }));
};
