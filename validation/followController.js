const joi=require("joi")

module.exports.follow=joi.object({
    id:joi.string().required()
})

module.exports.unfollow=joi.object({
    id:joi.string().required()
})

module.exports.following=joi.object({
    id:joi.string().required()
})
module.exports.unfollow=joi.object({
    id:joi.string().required()
})
module.exports.follower=joi.object({
    id:joi.string().required()
})