const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const user = require('../models/user');

const User = require('../models/user');

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 15)
    .then(hash =>{
        const user = new User ({
            email : req.body.email,
            password: hash
        });
        user.save()
            .then(()=> res.status(201).json({message: 'Utilisateur créé.'}))
            .catch(error => res.status(400).json({error}));
    })
    .catch(error => {
        res.status(500).json({error})});
};

exports.login = (req, res, next) => {
    console.log(req.body);
    User.findOne({email: req.body.email})
        .then(user => {
            console.log(user);
            if (user === null){
                res.status(401).json({message: 'Paire identifiant/mot de passe incorrecte.'});
            } else {
                bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid){
                        res.status(401).json({message: 'Paire identifiant/mot de passe incorrecte.'});
                    } else {
                        res.status(200).json({
                            userId: user._id,
                            token: jwt.sign(
                                {userId : user._id},
                                'random_token_secret',
                                {expiresIn: '24h'}
                            ),
                            moderator: user.moderator
                        });
                    }
                })
                .catch(error => res.status(500).json({error}));
            }
        })
        .catch(error => res.status(500).json({error}));
};

exports.getOneUser =(req, res, next) => {
    user.findOne({_id: req.params.id})
    .then(post =>{ 
         res.status(200).json(post)
    })
    .catch(error => {
        res.status(404).json({error})
    })
};
