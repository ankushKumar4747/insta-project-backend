const jwt=require("jsonwebtoken")
const Model=require("../models/index")


module.exports.getToken= async function(data){
    return jwt.sign(data,process.env.SECRET_KEY,{
        expiresIn: "60 days"
    });
    
};



module.exports.verifyToken = (token) =>
    jwt.verify(token, process.env.SECRET_KEY);

module.exports.verify = (...args) => async (req, res, next) => {
    try {
      let roles = [].concat(args).map((role) => role.toLowerCase());
      const token = String(req.headers.authorization || "")
        .replace(/bearer|jwt|Guest/i, "")
        .trim();
        
      let doc = null;
      let role = "";
      const decoded = this.verifyToken(token);
  
      if (decoded != null && roles.includes("user")) {
        console.log(decoded);
        role = "user";
        doc = await Model.User.findOne({
          _id: decoded._id,
          isBlocked: false,
          jti: decoded.jti,
          isDeleted: false,
        });
      }
    if (role) req[role] = doc.toJSON();

    next();
    } catch (error) {
      console.error(error);
      const message =
        String(error.name).toLowerCase() == "error" ?
        error.message :
        "UNAUTHORIZED ACCESS";
      return res.send(error);
    }
  }
