const joi=require("joi");

module.exports.register=joi.object({
    email:joi.string().email().required().error(new Error("enter valid email")),
    password:joi.string().min(6).required().error(new Error("enter valid password")),
    name: joi.string().optional(),
    dialCode: joi.string().optional(),
    phoneNo: joi.string().optional()
})

module.exports.login=joi.object({
    email: joi.string().email().required().error(new Error("Please Enter a valid email")),
    password:joi.string().required()
})


module.exports.updateProfile=joi.object({
    email:joi.string().email().optional().error(new Error("enter valied email")),
    name: joi.string().optional(),
    dialCode: joi.string().optional(),
    phoneNo: joi.string().optional(),
    isBlocked:joi.boolean().optional(),
    isDeleted:joi.boolean().optional()
})

module.exports.changePassword=joi.object({
    oldPassword:joi.string().required(),
    newPassword:joi.string().required()

})

module.exports.forgotPassword = joi.object({
    email: joi.string().email().required()
});
module.exports.verifyOtp=joi.object({
    code:joi.string().required(),
    email:joi.string().email().required()   
})  
module.exports.resetPassword=joi.object({
    id:joi.string().required(),
    newPassword:joi.string().required()
})
