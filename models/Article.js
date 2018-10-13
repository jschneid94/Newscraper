var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    headline: {
        type: String,
        required: true,
        unique: true
    },
    author: {
        type: String,
        require: true,
        unique: true
    },
    summary: {
        type: String,
        require: true,
        unique: true
    },
    link: {
        type: String,
        required: true,
        unique: true
    },
    imgUrl: {
        type: String,
        required: true,
        unique: true
    },
    comment: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }],
    saved: {
        type: Boolean,
        default: false
    }
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;