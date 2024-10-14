import mongoose from "mongoose";
import userModel from "./usermodel.js";
const blogSchema =new mongoose.Schema({
    title:{type:String,required:true},
    body:{type:String,required:true},
    author:{type:mongoose.Schema.Types.ObjectId,ref:'userModel',required:true},
    tags:{type:String},
    likes:{type:Number,default:0},
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'userModel' },
        comment: { type: String, required: true },
      }],
},{
    timestamps:true,
})

const blogModel=new mongoose.model('blogModel',blogSchema);
export default blogModel