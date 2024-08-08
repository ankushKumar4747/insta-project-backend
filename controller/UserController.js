const Model = require("../models/index");
const bcrypt = require("bcrypt");
// const Validation=require("../validation/index");
const Validation = require("../validation/index")
// const functions= require("../common/functions");
const functions = require("../common/functions")
const constants = require("../common/constants")
const emailService=require("../services/EmailService")
const mongoose = require("mongoose");       

const Auth = require("../common/authenticate");
// const { model } = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

module.exports.register = async (req, res, next) => {
    try {
        await Validation.User.register.validateAsync(req.body)
        if (req.body.email) {
            const checkEmail = await Model.User.findOne({
                email: (req.body.email).toLowerCase(),
                isDeleted: false
            });
            if (checkEmail) throw new Error(constants.MESSAGES.EMAIL_ALREADY_IN_USE);
        }
        const newUser = await Model.User(req.body)
        const salt = await bcrypt.genSalt(12)
        newUser.password = await bcrypt.hash(newUser.password, salt);

        await newUser.save();
        const userResponse = newUser.toObject()
        delete userResponse.password;
        await Validation.User.register.validate(req.body);
        return res.status(200).json(userResponse)

    } catch (error) {        
        return  res.status(401).json({
            success: false,
            message: error.message,
        });
    }
}
module.exports.login = async (req, res, next) => {

    try {
        await Validation.User.login.validateAsync(req.body);
        let user = await Model.User.findOne({
            email: (req.body.email).toLowerCase(),
            isDeleted: false
        });
        if (!user) throw new Error(constants.MESSAGES.INVALID_CREDENTIALS);

        if (user.isBlocked) {
            throw new Error(constants.MESSAGES.ACCOUNT_BLOCKED)
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password)
        if (!isMatch) throw new Error(constants.MESSAGES.INVALID_CREDENTIALS);

        user.loginCount += 1;
        user.jti = functions.generateRandomStringAndNumbers(25);
        await user.save();

        user = JSON.parse(JSON.stringify(user))
        user.accessToken = await Auth.getToken({
            _id: ObjectId(user._id),
            jti: user.jti,
        })
        console.log('user: ', user);
        delete user.password;
        return res.status(200).json({ user: user })
    } catch (error) {
        return  res.status(401).json({
            success: false,
            message: error.message,
        });
    }
}

module.exports.logout = async (req, res, next) => {
    try {
        await Model.User.updateOne({
            _id: ObjectId(req.user._id)
        }, {
            jti: ""
        });
        return res.status(200).json(constants.MESSAGES.LOGOUT_SUCCESS)
    } catch (error) {
        return  res.status(401).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports.getProfile = async (req, res, next) => {
    try {
        const user = await Model.User.findOne({
            _id: ObjectId(req.user._id)
        }, {
            password: 0
        })
        if (!user) throw new Error(constants.MESSAGES.ACCOUNT_NOT_FOUND)
        if (user.isBlocked) throw new Error(constants.MESSAGES.ACCOUNT_BLOCKED)
        return res.status(200).json({ msg: constants.MESSAGES.DATA_FETCHED, user: user })
    } catch (error) {
        return  res.status(401).json({
            success: false,
            message: error.message,
        });
    }
}

module.exports.updateProfile = async (req, res, next) => {
    try {
        await Validation.User.updateProfile.validateAsync(req.body);
        //$nin = not in 
        const nin = {
            $nin: [req.user._id]
        };

        if (req.body.email) {
            const checkEmail = await Model.User.findOne({
                _id: nin,
                email: (req.body.email).toLowerCase(),
                isDeleted: false
            })
            if (checkEmail) throw new Error(constants.MESSAGES.EMAIL_ALREADY_IN_USE)
            if (req.body.phoneNo) {
                const checkPhone = await Model.User.findOne({
                    _id: nin,
                    phoneNo: (req.body.phoneNo).toLowerCase(),
                    dialCode: req.body.dialCode,
                    isDeleted: false
                })
                if (checkPhone) throw new Error(constants.MESSAGES.PHONE_ALREADY_IN_USE)
            }
        }
        delete req.body.password;
        const update= await Model.User.findOneAndUpdate({
            _id: ObjectId(req.user._id)
        },{
            $set: req.body
        },{
            new: true
        })

        return res.status(200).json({msg:constants.MESSAGES.PROFILE_UPDATED_SUCCESSFULLY,data:update})

    } catch (error) {
        return  res.status(401).json({
            success: false,
            message: error.message,
        });


    }
}

module.exports.changePassword= async(req,res,next)=>{
    try{
        await Validation.User.changePassword.validateAsync(req.body)
        if(req.body.oldPassword==req.body.newPassword)
            throw new Error(constants.MESSAGES.PASSWORDS_SHOULD_BE_DIFFERENT)
        
        const doc= await Model.User.findOne({
            _id:ObjectId(req.user._id)
        })
       const checkOldPassword= await bcrypt.compare(req.body.oldPassword,doc.password);
       if(!checkOldPassword){
        throw new Error(constants.MESSAGES.INVALID_OLD_PASSWORD)
       }
       const salt = await bcrypt.genSalt(12)
       doc.password = await bcrypt.hash(req.body.newPassword, salt);

       await doc.save();
       return res.status(200).json(constants.MESSAGES.PASSWORD_CHANGED_SUCCESSFULLY)
    }catch(error){
        return  res.status(401).json({
            success: false,
            message: error.message,
        });
    }
}
module.exports.forgotPassword=async (req,res,next)=>{
    try{
        await Validation.User.forgotPassword.validateAsync(req.body)
        const check=await Model.User.findOne({
            email:(req.body.email).toLowerCase(),
            isDeleted:false
        });
        if(!check){
            throw new Error(constants.MESSAGES.ACCOUNT_NOT_FOUND)
        }
        let payload={
            email:(req.body.email).toLowerCase(),
        }
        await emailService.sendEmailVerification(payload)
        return res.status(200).json(constants.MESSAGES.LINK_SENT)
    }catch(error){
        return  res.status(401).json({
            success: false,
            message: error.message,
        });
    }

}
module.exports.verifyOtp = async (req, res, next) => {
    try {
        await Validation.User.verifyOtp.validateAsync(req.body);
        const lang = req.headers.language || "en";
        process.env.lang = lang;
        let check = await Model.User.findOne({
            email: (req.body.email).toLowerCase(),
            isDeleted: false
        }).lean();
        if (check == null) throw constants.MESSAGES.ACCOUNT_NOT_FOUND;
        const payload = {
            email: req.body.email,
            otp: req.body.code
        };
        let checkOtp = await Model.Otp.findOne(payload);
        if (checkOtp) {
            let jti =  functions.generateRandomStringAndNumbers(25);
            // check.save();
            check = await Model.User.findOneAndUpdate({
                _id: ObjectId(check._id)
            }, {
                $set: {
                    jti: jti
                }
            },{new:true});

            //deep copy
            check = JSON.parse(JSON.stringify(check));
            check.accessToken = await Auth.getToken({
                _id: ObjectId(check._id),
                jti: jti,
                role: "user"
            });
            delete check.password;
        } else {
            throw constants.MESSAGES.OTP_INVALID;
        }
        return res.status(200).json({msg:constants.MESSAGES.OTP_VERIFY,check})
    } catch (error) {
        return  res.status(401).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports.resetPassword = async (req, res, next) => {
    try {
        await Validation.User.resetPassword.validateAsync(req.body);
        const doc = await Model.User.findOne({
            _id:ObjectId(req.body.id),
            isDeleted: false
        });
        if (!doc) throw new Error(constants.MESSAGES.USER_DATA_MISSING);

        const salt = await bcrypt.genSalt(12)
        doc.password = await bcrypt.hash(req.body.newPassword, salt);

        await doc.save();
        return res.status(200).json(constants.MESSAGES.PASSWORD_RESET);
    } catch (error) {
        return  res.status(401).json({
            success: false,
            message: error.message,
        });
    }
};