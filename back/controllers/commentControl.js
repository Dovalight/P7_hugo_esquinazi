const Comment = require('../models/comment');

exports.createComment = (req, res, next) => {
    const commentObject = {...req.body};
    delete commentObject._id;
    delete commentObject._userId;
    const comment = new Comment ({
        ...commentObject,
        userId: req.auth.userId,
        postId: req.params.post
    });
    comment.save()
    .then(() => res.status(201).json({message: 'commentaire créer'}))
    .catch(error => {res.status(400).json({error})});
};

exports.modifyComment = (req, res, next) => {
    const commentObject = {...req.body}; 
    delete commentObject._userId;
    Comment.findOne({_id: req.params.id})
        .then((comment)=> {
            if (comment.userId != req.auth.userId) {
                res.status(401).json({message: 'non-autorisé'});
            } else { 
                Post.updateOne({_id: req.params.id}, {...postObject, _id: req.params.id})
                .then(()=> res.status(200).json({message: 'Commmentaire modifié'}))
                .catch(error => res.status(401).json({error}));
            }
        })
        .catch(error => res.status(400).json({error}));
};

exports.deleteComment = (req, res, next) => {
    Comment.findOne({_id: req.params.id})
    .then(comment => {
        if (comment.userId != req.auth.userId){
            res.status(401).json({message : 'non-autorisé'});
        } else {
                Post.deleteOne({_id: req.params.id})
                .then(()=> res.status(200).json({message: 'Post supprimé'}))
                .catch(error => res.status(401).json({error}));
            }
        })
    };

exports.getAllComment = (req, res, next) => {
    Comment.find()
      .then(post => res.status(200).json(post))
      .catch(error => res.status(400).json({error}));
};