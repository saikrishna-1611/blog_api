import express from "express";
import { commentBlog, createBlog, deleteBlog, getBlogs, likeBlog, login, register } from "../controller/controller.js";
import { authUser } from "../middleware/authUser.js";

const router=express.Router();

router.post('/register',register);
router.post('/login',login);
router.post('/create-blog',authUser,createBlog);
router.post('/like/:_id',authUser,likeBlog);
router.post('/comment/:_id',authUser,commentBlog);
router.delete('/delete/:_id',authUser,deleteBlog);
router.get('/get-blogs',authUser,getBlogs);
export default router