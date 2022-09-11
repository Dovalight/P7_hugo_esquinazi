const Sauce = require('../models/post');
const fs = require('fs');
const { json } = require('express');


exports.createSauce = (req, res, next) =>{
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce ({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
    });
    sauce.save()
    .then(() => res.status(201).json({message: 'Sauce enregistée'}))
    .catch(error => {res.status(400).json({error})});
 };

exports.modifySauce = (req, res, next)=>{
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};
     
    delete sauceObject._userId;
    Sauce.findOne({_id: req.params.id})
        .then((sauce)=> {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({message: 'non-autorisé'});
            } else { 
                if(req.file){
                    const filename = sauce.imageUrl.split('/images')[1];
                    fs.unlink(`images/${filename}`, () =>{})
                }
                Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
                .then(()=> res.status(200).json({message: 'Sauce modifiée'}))
                .catch(error => res.status(401).json({error}));
            }
        })
        .catch(error => res.status(400).json({error}));
};

exports.deleteSauce = (req, res, next)=>{
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
        if (sauce.userId != req.auth.userId){
            res.status(401).json({message : 'non-autorisé'});
        } else {
            const filename = sauce.imageUrl.split('/images')[1];
            fs.unlink(`images/${filename}`, () =>{
                Sauce.deleteOne({_id: req.params.id})
                .then(()=> res.status(200).json({message: 'Sauce supprimée'}))
                .catch(error => res.status(401).json({error}));
            })
        }
    })
    .catch(error => res.status(500).json({error}));
};

exports.getOneSauce = (req, res, next)=>{
    Sauce.findOne({_id: req.params.id})
    .then(sauce =>{ console.log(sauce);
         res.status(200).json(sauce)
    })
    .catch(error => {
        res.status(404).json({error})
    })
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({error}));
};

exports.likeSauce = (req, res, next)=>{
    const sauce = Sauce.findByIdAndUpdate(req.params.id);
    sauce.then((sauceLike) => {
        switch (req.body.like) {
            case 1:
                Sauce.updateOne(
                    { _id: sauceLike.id },
                    {
                        $inc: {likes : 1},
                        $push: {usersLiked: req.body.userId},
                    })
                .then(() => res.status(200).json({message: 'Sauce liked'}))
                .catch(error => res.status(400).json({error}));
                console.log("J'aime");
                break;

            case -1:
                Sauce.updateOne(
                    { _id: sauceLike.id },
                    {
                        $inc: {dislikes: -1}, 
                        $push: { usersDisliked: req.body.userId },
                    })
                    .then(() => res.status(200).json({message: 'Sauce disliked'}))
                    .catch(error => res.status(400).json({error}));
                console.log("J'aime pas");
                break;

            case 0:
                if (sauceLike.usersLiked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked:
                    req.body.userId }, $inc: { likes: -1 } })
                    .then((sauce) => { res.status(200).json({ message: 'Like supprimé !' }) })
                    .catch(error => res.status(400).json({ error }))
                    } 
                    else if (sauceLike.usersDisliked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked:
                    req.body.userId }, $inc: { dislikes: -1 } })
                    .then((sauce) => { res.status(200).json({ message: 'Dislike supprimé !' }) })
                    .catch(error => res.status(400).json({ error }))
                    }
                break;
        }
    })
    .catch(error => res.status(400).json({error}));
};
