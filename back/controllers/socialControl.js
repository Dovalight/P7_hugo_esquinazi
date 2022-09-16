const Post = require('../models/post');
const fs = require('fs');
const { json } = require('express');

exports.createPost = (req, res, next) =>{
    const postObject = {...req.body};
    const file = req.files ? req.files[0] : undefined
    delete postObject._id;
    delete postObject._userId;
    const post = new Post ({
        ...postObject,
        userId: req.auth.userId,
        imageUrl: file ? `${req.protocol}://${req.get('host')}/images/${file.filename}` : null,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
    });
    post.save()
    .then(() => res.status(201).json({message: 'post créer'}))
    .catch(error => {res.status(400).json({error})});
 };

exports.modifyPost = (req, res, next)=>{
    const file = req.files ? req.files[0] : undefined
    const postObject = file ? {
        ...req.body,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${file.filename}`
    } : {...req.body};    
    delete postObject._userId;
    Post.findOne({_id: req.params.id})
        .then((post)=> {
            if (post.userId != req.auth.userId) {
                res.status(401).json({message: 'non-autorisé'});
            } else { 
                if(file){
                    const filename = post.imageUrl.split('/images')[1];
                    fs.unlink(`images/${filename}`, () =>{})
                }
                Post.updateOne({_id: req.params.id}, {...postObject, _id: req.params.id})
                .then(()=> res.status(200).json({message: 'Post modifié'}))
                .catch(error => res.status(401).json({error}));
            }
        })
        .catch(error => res.status(400).json({error}));
};

exports.deletePost = (req, res, next)=>{
    console.log(req.params);
    Post.findOne({_id: req.params.id})
    .then(post => {
        console.log(post);
        console.log(post.userId);
        console.log(req.auth.userId);
        if (post.userId != req.auth.userId){
            res.status(401).json({message : 'non-autorisé'});
        } else {
            Post.deleteOne({_id: req.params.id})
            .then(()=> {
                if(post.imageUrl ){const filename = post.imageUrl.split('/images')[1];
                fs.unlink(`images/${filename}`, () =>{
                })}
                res.status(200).json({message: 'Post supprimé'})})
            .catch(error => res.status(401).json({error}));        
        }
    })
    .catch(error =>{
         console.log(error)
   res.status(500).json({error}) } );
};

exports.getOnePost = (req, res, next)=>{
    Post.findOne({_id: req.params.id})
    .then(post =>{ 
         res.status(200).json(post)
    })
    .catch(error => {
        res.status(404).json({error})
    })
};

exports.getAllPost = (req, res, next) => {
    Post.find()
      .then(post => res.status(200).json(post))
      .catch(error => res.status(400).json({error}));
};

exports.likePost = (req, res, next)=>{
    const post = Post.findByIdAndUpdate(req.params.id);
    post.then((postLike) => {
        switch (JSON.parse(req.body.like)) {
            case 1:
                Post.updateOne(
                    { _id: postLike.id },
                    {
                        $inc: {likes : 1},
                        $push: {usersLiked: req.body.userId},
                    })
                .then(() => res.status(200).json({message: 'Post liked'}))
                .catch(error => res.status(400).json({error}));
                break;

            case -1:
                Post.updateOne(
                    { _id: postLike.id },
                    {
                        $inc: {dislikes: -1}, 
                        $push: { usersDisliked: req.body.userId },
                    })
                    .then(() => res.status(200).json({message: 'Post disliked'}))
                    .catch(error => res.status(400).json({error}));
                break;

            case 0:
                if (postLike.usersLiked.includes(req.body.userId)) {
                    Post.updateOne({ _id: req.params.id }, { $pull: { usersLiked:
                    req.body.userId }, $inc: { likes: -1 } })
                    .then((post) => { res.status(200).json({ message: 'Like supprimé !' }) })
                    .catch(error => res.status(400).json({ error }))
                    } 
                    else if (postLike.usersDisliked.includes(req.body.userId)) {
                    Post.updateOne({ _id: req.params.id }, { $pull: { usersDisliked:
                    req.body.userId }, $inc: { dislikes: -1 } })
                    .then((post) => { res.status(200).json({ message: 'Dislike supprimé !' }) })
                    .catch(error => res.status(400).json({ error }))
                    }
                break;
        }
    })
    .catch(error => res.status(400).json({error}));
};
