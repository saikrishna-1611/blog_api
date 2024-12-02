import userModel from "../models/usermodel.js";
import blogModel from "../models/blogmodel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
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

     const token=jwt.sign({_id:User._id,role:User.role},process.env.JWT_SECRET_KEY,{expiresIn:'1d'});
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
  const author=req.user._id;
  const existingBlog=await blogModel.findOne({$and:[{author},{title}]});
  if(existingBlog){
    return res.status(400).json({message:"blog already exists for the user"});
  }
  const Blog=new blogModel({
    title,
    body,
    author:author,
    tags
  });
  await Blog.save();
  return res.status(201).json({Blog});
}
catch(error){
  if (!res.headersSent){return res.status(500).json({status:'fail',message:error.message})}
    
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

export const commentBlog = async (req, res) => {
  try {
      const { _id } = req.params;   // Blog ID from URL params
      const { comment } = req.body;  // Comment text from request body

      if (!_id) {
          return res.status(400).json({ message: "Enter blog id in query URL" });
      }

      const blog = await blogModel.findById(_id);
      if (!blog) {
          return res.status(400).json({ message: "Blog doesn't exist for the given ID" });
      }

      const user = req.user._id;  // Get the user ID from the authenticated user

      // Check if the same user is commenting again and handle as per your requirements
      blog.comments.push({ user, comment });
      await blog.save();  // Save the blog with the new comment added

      return res.status(200).json({ blog });
  } catch (error) {
      return res.status(500).json({ status: 'fail', message: error.message });
  }
};

export const getCommentsOfaPost=async(req,res)=>{
  try{
    const {_id}=req.params;
    if(!_id){
      return res.status(400).json({message:"enter valid blog id"});
    }
    const Blog=await blogModel.findById(_id);
    if(!Blog){
      return res.status(400).json({message:"Blog doesn't exist for the given Id"});
    }
    return res.status(200).json(Blog.comments);
  }
  catch(error){
      return res.status(500).json({status:'fail',message:error.message})
  }
  
}

export const singleCommentbyItsId =async(req,res)=>{
  try{
   const {_id}=req.params; //comment id
   const {id}=req.query;   //blog id
   if(!_id){
    return res.status(400).json("enter valid comment id");
   }
   const blog = await blogModel.findById(id);
if (!blog) {
    return res.status(400).json({ message: "Blog doesn't exist for the given Id" });
}
const comment = blog.comments.find(c => c._id.toString() === _id);
if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
}
return res.status(200).json(comment);
  }
  catch(error){
    return res.status(500).json({message:error.message})
  }
}

export const deleteBlog=async(req,res)=>{
    try{
    const{_id:userId}=req.user;
    const{_id}=req.params;
    if(!_id){
        return res.status(400).json({message:"enter blog id in the url query"});
    }
    const blog=await blogModel.findOne({_id,author:userId});
    if(!blog){
      return res.status(400).json({message:"blog id is not valid or ur not a blog author"});
    }
    await blogModel.findByIdAndDelete(_id);
  
   return res.status(200).json({message:"Blog removed"})
    }
    catch(error){
        return res.status(500).json({status:'fail',message:error.message})
    }
};

export const getBlogs=async(req,res)=>{
    try{
     const blogs=await blogModel.find({}).populate('author','name');
     return res.status(200).json({blogs});
    }
    catch(error){
        return res.status(500).json({status:'fail',message:error.message})
    }
}

export const blogofParticularUser=async(req,res)=>{
  try{
  const {_id}=req.params;
  const Blog=await blogModel.find({author:_id}).populate('author','name');
  return res.status(200).json({Blog});
  }
  catch(error){
    return res.status(500).json({status:'fail',message:error.message}) 
}
}

export const deleteAllBlogsByAdmin=async(req,res)=>{
  try{
    await blogModel.deleteMany({});
    return res.status(200).json({message:"deleted all"});
  }
  catch(error){
    return res.status(500).json({status:'fail',message:error.message}) 
}
}

export const deletecomment=async(req,res)=>{
  try{
  const {_id}=req.params;   //comment id
  const blogid=req.query.id;   //blog id
  if (!mongoose.Types.ObjectId.isValid(_id) || !mongoose.Types.ObjectId.isValid(blogid)) {
    return res.status(400).json({ message: "Comment ID and Blog ID are required." });
}
 const blog=await blogModel.findById(blogid);
 if(!blog){
  return res.status(400).json({message:'blog not exists'});
 }
 const comment=blog.comments.id(_id);
 if(!comment){
  return res.status(400).json({message:"comment not exists"});
 }
 if(comment.user.toString() !== req.user._id.toString()){
  return res.status(400).json({ message: "You are not authorized to delete this comment."})
 }
 blog.comments.pull(_id);
 await blog.save();
 return res.status(200).json({ message: "Comment deleted successfully." });
  }
  catch(error){
    return res.status(500).json({status:'fail',message:error.message}) 
  }
}


export const deleteallcommentsofaBlog=async(req,res)=>{
  try{
   const {_id}=req.params;
   const blog=await blogModel.findById(_id);
   if(!blog){
    return res.status(400).json({message:"blog not exists with the id"});
   }
  blog.comments=[];
   await blog.save();
   return res.status(200).json({ message: "Comments deleted successfully." });
  
  }
  catch(error){
    return res.status(500).json({status:'fail',message:error.message}) 
  }
}

export const updatePost=async(req,res)=>{
  try{
   const {newtitle,newbody,newtags}=req.body;
   const{_id}=req.params;
   const {_id:userId}=req.user;
   const blog=await blogModel.findOne({_id,author:userId});
   if(!blog){
    return res.status(400).json({message:"blogid is invalid or the user is not owner of the blog"});
   }
    blog.title=newtitle;
    blog.body=newbody;
    blog.tags=newtags;
    await blog.save();
    return res.status(200).json({message:"Blog updated with new records"});
  }
  catch(error){
    return res.status(500).json({status:'fail',message:error.message}) 
  }
}


export const updateComment=async(req,res)=>{
  try{
   const {_id}=req.params;
   const blogid=req.query.id;
   const {_id:userId}=req.user;
   const {newcomment}=req.body;
   if(!_id||!blogid){
    return res.status(400).json({message:"all feilds are required"});
   }
   const blog=await blogModel.findOne({_id:blogid,author:userId});
   if(!blog){
    return res.status(400).json({message:"Blog doesn't exist or ur not the author of the blog"});
   }
   const com=blog.comments.id(_id);
   com.comment=newcomment;
   await blog.save();
   return res.status(200).json({ message: "Comment updated successfully.", blog });
  }
  catch(error){
    return res.status(500).json({status:'fail',message:error.message}) 
  }
}