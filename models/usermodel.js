import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{type:String,required:true},
    emailid:{type:String,required:true,unique:true},
    age:{type:Number,required:true},
    phoneNumber:{type:String,required:true,unique:true},
    password:{type:String,required:true},
})
const userModel=new mongoose.model('userModel',userSchema);
export default userModel