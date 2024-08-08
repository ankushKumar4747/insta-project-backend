const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const OtpModel = new Schema({
    otp: {
        type: String,
        default: "",
        trim: true
    },
    phoneNo: {
        type: String,
        trim: true,
        default: "",
        index: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        default: "",
        index: true
    },
    dialCode: {
        type: String,
        default: "",
        trim: true,
        index: true
    },
    expiredAt: {
        type: Date,
        default: new Date()
    },
    userId: {
        type: ObjectId,
        ref: 'User',
        default: null,
        index: true
    }
}, {
    timestamps: true,
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});
const Otp = mongoose.model('Otp', OtpModel);
module.exports = Otp;
