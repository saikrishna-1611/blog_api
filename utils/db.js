import mongoose from "mongoose";
const connectDb=async(req,res)=>{
    try{
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("connected to MongoDB");
    }
    catch(error){
        return res.status(500).json({status:'fail',message:error.message})
    }
}

export default connectDb