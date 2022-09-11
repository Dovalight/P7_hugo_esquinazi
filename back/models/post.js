const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    userId: {type: String, required: true},
    name: {type: String, required: true},
    post: {type: String, required: true},
    imageUrl: {type: String},
    likes : {type: Number, required: true},
    dislikes : {type: Number, required: true},
    usersLiked: {type: [], required: true},
    usersDisliked: {type: [], required: true},
});

module.exports = mongoose.model('post', postSchema);