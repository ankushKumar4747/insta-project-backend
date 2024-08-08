const _ = require("lodash");
const moment=require("moment")
const path=require("path")

const multer=require("multer");

// const crypto = require('crypto');
// const constants = require("./constants");


module.exports.generateRandomStringAndNumbers=function(len){
    let text=_.times(len,()=> _.random(35).toString(36)).join("")
    return text;
}
module.exports.fileUploader = function (fileField) {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, '../fileFromMulter')); 
        },
        filename: function (req, file, cb) {
            cb(null,file.originalname);
        }
    });

    const upload = multer({ storage: storage });
    if(!upload)
        throw new Error("file upload unseccessfully");

    return upload.single(fileField); 
};
