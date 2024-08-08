const router=require("express").Router();
const Controller=require("../controller/index")
const functions=require("../common/functions")


router.post("/fileUpload",functions.fileUploader("file"),Controller.postController.fileUpload)

module.exports=router;