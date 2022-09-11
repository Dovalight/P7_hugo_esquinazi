const mongoose = require('mongoose');

const commentSchema = mongoose.Schema ({
    userId: {type: String, required: true},
    postId: {type: String, required: true},
    comment: {type: String, required: true},

});

module.exports = mongoose.model('comment', commentSchema);