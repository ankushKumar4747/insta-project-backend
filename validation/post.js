const joi=require("joi");
// const { post } = require(".");

module.exports.uploadPost=joi.object({
    imageUrl:joi.string().required().error(new Error("invalid image url")),
    caption:joi.string().optional()
})
module.exports.getPosts=joi.object({
    user:joi.string().optional()
})

module.exports.updatePost=joi.object({
    id:joi.string().optional(),
    caption:joi.string().optional()
})

module.exports.deletePost=joi.object({
    postId:joi.string().optional()
})

module.exports.like=joi.object({
    likeId:joi.string().optional()
})

