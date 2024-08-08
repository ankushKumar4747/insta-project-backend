const mongoose=require("mongoose")

const postSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    caption: {
      type: String,
      default:"",
      maxlength: 2200 
    },
    imageUrl: {
      type: String,
      required: true
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    isDeleted:{
      type:Boolean,
      default:false
    }
  },{timestamps:true});
  
  const Post = mongoose.model('Post', postSchema);
  
  module.exports = Post;