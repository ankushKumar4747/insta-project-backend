const Model = require("../models/index");
const Validation = require("../validation/index")
const mongoose = require("mongoose");
const constants = require("../common/constants");
const { $where } = require("../models/User");
const ObjectId = mongoose.Types.ObjectId;

module.exports.follow = async (req, res, next) => {
  try {
    await Validation.followController.follow.validateAsync(req.body);

    const findUser = await Model.followerAndFollowing.findOne({ user: ObjectId(req.user._id) });
    console.log('findUser: ', findUser);

    const findFollowing = await Model.followerAndFollowing.findOne({ user: ObjectId(req.body.id) });
    console.log('findFollowing: ', findFollowing);


    if (findUser == null) {
      await Model.followerAndFollowing.create({
        following: [req.body.id],
        user: req.user._id
      });
    } else {
      await Model.followerAndFollowing.findOneAndUpdate(
        { user: req.user._id },
        { $addToSet: { following: req.body.id } },
        { new: true }
      );
    }

    if (findFollowing == null) {
      await Model.followerAndFollowing.create({
        follower: [req.user._id],
        user: req.body.id
      });
    } else {
      await Model.followerAndFollowing.findOneAndUpdate(
        { user: req.body.id },
        { $addToSet: { follower: req.user._id } },
        { new: true }
      );
    }

    res.status(200).json({ msg: "following successfully" });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.getFollowing = async (req, res, next) => {
  try {
    Validation.followController.following.validateAsync(req.body);
    // const findUser=await Model.User.findOne({_id:req.body.id});
    const aggre = await Model.followerAndFollowing.aggregate([
      {
        $match: {
          user: ObjectId(req.body.id)
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "following",
          foreignField: "_id",
          as: "following"
        }
      }, {
        $unwind: "$following"

      },
      {
        $project: {
          "following._id": 1,
          "following.name":1
        },
      }
    ])
    console.log(aggre);
    res.status(200).json({ size: aggre.length,aggre })
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports.unfollow = async (req, res, next) => {
  try {
    Validation.followController.unfollow.validateAsync(req.body);
    const doc = await Model.followerAndFollowing.findOne({ user: req.user._id });
    const findUser = await doc.following.includes(req.body.id)
    if (findUser) {
      const deleteUser = await Model.followerAndFollowing.findOneAndUpdate({
        user: req.user._id
      }, {
        $pull: {
          following: req.body.id
        }
      })
      res.status(200).json({ message: "User unfollowed successfully" })
    } else {
      throw new Error(constants.MESSAGES.USER_DATA_MISSING)
    }

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    })
  }
}

module.exports.getFollowers = async (req, res, next) => {
  try {
    Validation.followController.follower.validateAsync(req.body);
    const agrre= await Model.followerAndFollowing.aggregate([
      {
        $match:{
          user:ObjectId(req.body.id)
        }
        },{
            $lookup:{
                from:"users",
                localField: "follower",
          foreignField: "_id",
          as:"followers" 
        }
      },{
          $unwind:"$followers"
        },{
            $project:{
                "followers._id":1,
                "followers.name":1
              }
          }
        ])
    const count=agrre.length
    res.status(200).json({size:count,agrre})


  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })

  }

}

