const Comment = require('../models/comment');

exports.createComment = (req, res, next) => {

};

exports.modifyComment = (req, res, next) => {

};

exports.deleteComment = (req, res, next) => {

};

exports.getAllComment = (req, res, next) => {
    Comment.find()
      .then(post => res.status(200).json(post))
      .catch(error => res.status(400).json({error}));
};