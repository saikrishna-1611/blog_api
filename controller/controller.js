import userModel from "../models/usermodel.js";
import blogModel from "../models/blogmodel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const register=async(req,res)=>{
    try{
      const{name,emailid,age,phoneNumber,password}=req.body;
      if(!name||!emailid||!age||!phoneNumber||!password){
        return res.status(400).json({status:'fail',message:"enter all feilds"})
      }
      const existingUser=await userModel.findOne({$or:[{emailid},{phoneNumber}]});
      if(existingUser){
        return res.status(400).json({message:"user already exists"});
      }
      //hash password before saving
      const hashedpassword=await bcrypt.hash(password,10);
      const User=new userModel(
        {
            name,
            emailid,
            age,
            phoneNumber,
            password:hashedpassword
        }
      );
      await User.save();
      return res.status(201).json(User);
    }
    catch(error){
        return res.status(500).json({status:'fail',message:error.message})
    }
};

export const login=async(req,res)=>{
    try{
     const{emailid,password}=req.body;
     if(!emailid||!password){
        return res.status(400).json({message:"all feilds are required"});
     }
     const User=await userModel.findOne({emailid});
     if(!User){
        return res.status(400).json({message:"emailid is not registered"});
     }
     //compare the password
     const isMatch=await bcrypt.compare(password,User.password);
     if(!isMatch){
        return res.status(400).json({messsage:"invalid password"});
     }
     //generate jwt

     const token=jwt.sign({_id:User._id},process.env.JWT_SECRET_KEY,{expiresIn:'1d'});
     return res.status(200).json({User,token});
    }
    catch(error){
        return res.status(500).json({status:'fail',message:error.message})
    }
};

export const createBlog=async(req,res)=>{
try{
  const {title,body,tags}=req.body;
  if(!title||!body){
    return res.status(400).json({message:"all feilds are required(title and body)"});
  }
  const owner=req.user._id;
  const existingBlog=await blogModel.findOne({$and:[{owner},{title}]});
  if(existingBlog){
    return res.status(400).json({message:"blog already exists for the user"});
  }
  const Blog=new blogModel({
    title,
    body,
    author:owner,
    tags
  });
  await Blog.save();
  return res.status(201).json({Blog});
}
catch(error){
    return res.status(500).json({status:'fail',message:error.message})
}
};

export const likeBlog=async(req,res)=>{
    try{
     const{_id}=req.params;
     if(!_id)
     {
        return res.status(400).json({message:"enter blog id to like in query url"});
     }
     const Blog=await blogModel.findById(_id);
     if(!Blog){
        return res.status(400).json({message:"Blog doesn't exist for the given Id"});
     }
     Blog.likes+=1;
     await Blog.save();
     return res.status(200).json({Blog});
    }
    catch(error){
        return res.status(500).json({status:'fail',message:error.message})
    }
};

export const commentBlog=async(req,res)=>{
    try{
     const {_id}=req.params;
     const{comment}=req.body;
     if(!_id){
        return res.status(400).json({message:"enter blog id in query url"});
     }
     const Blog=await blogModel.findById(_id);
     if(!Blog){
        return res.status(400).json({message:"Blog doesnt exist for the given Id"})
     }
     const user=req.user._id;
     Blog.comments.push({ user: req.user._id, comment });
     await Blog.save();
     return res.status(200).json({Blog});
    }
    catch(error){
        return res.status(500).json({status:'fail',message:error.message})
    }
}

export const deleteBlog=async(req,res)=>{
    try{
    const{_id}=req.params;
    if(!_id){
        return res.status(400).json({message:"enter blog id in the url query"});
    }
    const Blog=await blogModel.findByIdAndDelete(_id);
    if(!Blog){
        return res.status(400).json({message:"Blog doesnt exist for the given Id"})
    }
   return res.status(200).json({message:"Blog removed"})
    }
    catch(error){
        return res.status(500).json({status:'fail',message:error.message})
    }
};

export const getBlogs=async(req,res)=>{
    try{
     const blogs=await blogModel.find({});
     return res.status(200).json({blogs});
    }
    catch(error){
        return res.status(500).json({status:'fail',message:error.message})
    }
}