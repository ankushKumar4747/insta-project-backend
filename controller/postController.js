const functions = require("../common/functions");
const Validation = require("../validation/index");
const Model = require("../models/index")
const path = require("path")
const mongoose=require("mongoose")
const constants = require("../common/constants")
const ObjectId=mongoose.Types.ObjectId


module.exports.fileUpload = async (req, res, next) => {
    try {
        url = path.join(__dirname, '../fileFromMulter')
        console.log('url: ', url);
        return res.status(200).json({ msg: constants.MESSAGES.UPLOAD_FILE_success, url: url })

    } catch (error) {
        return  res.status(401).json({
            success: false,
            message: error.message,
        });
    }
}

module.exports.uploadPost = async (req, res, next) => {
    console.log(".......................... ");
    try {
        Validation.post.uploadPost.validateAsync(req.body);
        const newPost = await Model.post(req.body);
        const doc = await Model.User.findOne({ _id: req.user._id })
        const payload = {
            user: ObjectId(doc._id),
            imageUrl: req.body.imageUrl,
            caption: req.body.caption
        }
        const response = await Model.post.create(payload)
        console.log('response: ', response);

        res.status(200).json({ msg: constants.MESSAGES.UPLOAD_POST_success })

    } catch (error) {
        return  res.status(401).json({
            success: false,
            message: error.message,
        });
    }
}

module.exports.getPosts = async (req, res, next) => {
    try {
        Validation.post.getPosts.validateAsync(req.body)

        if (req.body.user) {
            const doc = await Model.User.findOne({ _id: req.body.user })
            console.log('doc: ', doc);
            const posts = await Model.post.find({ user: ObjectId(doc._id) ,isDeleted:false}).select("imageUrl likes")
            console.log('posts: ', posts);
            return res.status(200).json({ posts })

        }
        const postUrl = await Model.post.aggregate([
            {
                $addFields: {
                    numberOfLikes: { $size: "$likes" }
                }
            },
            {
                $project: {
                    _id: 1,          // Include the post ID
                    user:1,  // Include the post content
                    numberOfLikes: 1 // Include the number of likes
                }
            }
        ]);
        
        console.log(postUrl);
        

        return res.status(200).json(postUrl)


    }
    catch (error) {
        return  res.status(401).json({
            success: false,
            message: error.message,
        });
    }
}

module.exports.updatePost = async (req, res, next) => {
    try {
        Validation.post.updatePost.validateAsync(req.body)
        const doc = await Model.User.findOne({ _id: req.user._id })
        if (doc == null) {
            throw new Error(constants.MESSAGES.INVALID_CREDENTIALS)
        }
        const update = await Model.post.findOneAndUpdate({
            _id: ObjectId(req.body.id),
            user:ObjectId(doc._id)
        },
        {
            $set:{caption:req.body.caption}
        }, { new: true });
        

       if(update==null){
        throw new Error(constants.MESSAGES.INVALID_CREDENTIALS)
       }
    res.status(200).json({ msg: constants.MESSAGES.UPDATE_POST_success })

    } catch (error) {
        return  res.status(401).json({
            success: false,
            message: error.message,
        });
    }
}

module.exports.deletePost=async(req,res,next)=>{
    try{
        Validation.post.deletePost.validateAsync(req.body)
        const doc = await Model.User.findOne({ _id: req.user._id })
        console.log('doc: ', doc);
        if (doc == null) {
            throw new Error(constants.MESSAGES.POST_NOT_FOUND)
        }
        const findPost = await Model.post.findOneAndUpdate({
            _id: ObjectId(req.body.postId),
            user:ObjectId(doc._id)
        },
        {
            $set:{isDeleted:true}
        }, { new: true });


        console.log('findPost: ', findPost);
        // if(findPost==null){
        //     throw new Error(constants.MESSAGES.POST_NOT_FOUND)
        //     }
            res.status(200).json({ msg: constants.MESSAGES.DELETE_POST_SUCCESS })

    }catch(error){
        return  res.status(401).json({
            success: false,
            message: error.message,
        });
    }
}

module.exports.postLike=async(req,res,next)=>{
    try{
        Validation.post.like.validateAsync(req.body);
        // const doc = await Model.User.findOne({ _id: req.user._id })

        const doc= await Model.post.findOne({_id:req.body.likeId})
        const hasLike= await doc.likes.includes(req.user._id)
        if(hasLike){
            const updateDoc=await Model.post.findOneAndUpdate({_id:req.body.likeId},{$pull:{
                likes:req.user._id}
            })
            return res.status(200).json({msg:constants.MESSAGES.UNLIKE_SUCCESSFULL})
        }else{

                const findPost= await Model.post.findOneAndUpdate({
                    _id:ObjectId(req.body.likeId)
                },{
                    $addToSet:{
                        likes:ObjectId(req.user._id)
                    }
                },{new:true}) 
            }


      return  res.status(200).json({msg:constants.MESSAGES.LIKE_SUCCESSFULL})

    }catch(error){
        return  res.status(401).json({
            success: false,
            message: error.message,
            });
    }
}