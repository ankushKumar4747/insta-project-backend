const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const followerAndFollowing = mongoose.Schema({
    user:{type:ObjectId},
    follower: [{type: ObjectId, ref: 'User',default:""}],
    following: [{type: ObjectId, ref: 'User',default:""}],
},{timestamps:true});


module.exports=mongoose.model("followerAndFollowing",followerAndFollowing);
