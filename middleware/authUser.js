import userModel from "../models/usermodel.js";
import jwt from "jsonwebtoken";

export const authUser=async(req,res,next)=>{
try{
 const authHeaders=req.headers["authorization"];
 let token
 if(authHeaders!==undefined){
    token=authHeaders.split(" ")[1];
 }
 if(token===undefined){
    return res.status(400).json({status:'fail',message:"Please LogIn"})
 }
 const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY);
 if(!decoded){
    return res.status(400).json({status:'fail',message:"Invalid Token"})
 }
 req.user={_id: decoded._id,role:decoded.role };
 next();
 console.log(req.user);
}
catch(error){
    return res.status(500).json({status:'fail',message:"something went wrong"})
}
}