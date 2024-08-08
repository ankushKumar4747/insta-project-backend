const router = require("express").Router();
const User = require("./User");
const upload= require("./upload")



router.use("/User", User);
router.use("/upload",upload)



module.exports = router;