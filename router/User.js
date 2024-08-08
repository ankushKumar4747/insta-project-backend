const router=require("express").Router();
const Controller=require("../controller/index")
const Auth=require("../common/authenticate")


//onBoarding routes
router.post("/register",Controller.UserController.register);
router.post("/login",Controller.UserController.login);
router.post("/logout",Auth.verify("user"),Controller.UserController.logout);
router.get("/profile",Auth.verify("user"),Controller.UserController.getProfile);
router.put("/updateProfile",Auth.verify("user"),Controller.UserController.updateProfile);
router.post("/changePassword",Auth.verify("user"),Controller.UserController.changePassword);
router.post("/forgetPassword",Controller.UserController.forgotPassword);
router.post("/otpVerify",Controller.UserController.verifyOtp);
router.post("/resetPassword",Controller.UserController.resetPassword);

//post routes
router.post("/uploadPost",Auth.verify("user"),Controller.postController.uploadPost)
router.get("/getPosts",Auth.verify("user"),Controller.postController.getPosts)
router.put("/updatePost",Auth.verify("user"),Controller.postController.updatePost)
router.delete("/deletePost",Auth.verify("user"),Controller.postController.deletePost)

router.post("/postLike",Auth.verify("user"),Controller.postController.postLike)

//followerAndFollowing routes

router.post("/follow",Auth.verify("user"),Controller.followController.follow)
router.post("/unfollow",Auth.verify("user"),Controller.followController.unfollow)
router.get("/getFollowers",Auth.verify("user"),Controller.followController.getFollowers)
router.get("/getFollowing",Auth.verify("user"),Controller.followController.getFollowing)



module.exports=router