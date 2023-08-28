import users from "../models/auth.js"

const auth=async(req,res,next)=>{
    const {email}=req.body;
    const  user = await users.findOne({ email });
    let block=user.isBlock;
    if(block === false){
        next()
    }
    else{
        return res.status(401).json("user is blocked by admin")
    }
}
export default auth;