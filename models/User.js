const mongoose= require("mongoose")
const userSchema=new mongoose.Schema({
    name: {
        type: String,
        default:""
    },
    email: {
        type: String,
        default:"",
        lowercase:true
        },
    phoneNo:{
        type: String,
        default:""
    },
    password: {
        type: String,
        default:""
        },
    isBlocked:{
        type:Boolean,
        default:false
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    dialCode:{
        type:String,
        default:""
    },
    loginCount: {
        type: Number,
        default: 0
    },
    jti: {
        type: String,
        default: ""
    },
},{timestamps:true})
module.exports=mongoose.model("User",userSchema)