const Comment = require('../models/comment');

exports.createComment = (req, res, next) => {
    const commentObject = JSON.parse(req.body.post);
    const file = req.files ? req.files[0] : undefined
    delete commentObject._id;
    delete commentObject._userId;
    const comment = new Comment ({
        ...commentObject,
        userId: req.auth.userId,
    });
    post.save()
    .then(() => res.status(201).json({message: 'post créer'}))
    .catch(error => {res.status(400).json({error})});
};

exports.modifyComment = (req, res, next) => {

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