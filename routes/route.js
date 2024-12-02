import express from "express";
import { blogofParticularUser, commentBlog, createBlog, deleteAllBlogsByAdmin, deleteallcommentsofaBlog, deleteBlog, deletecomment, getBlogs, getCommentsOfaPost, likeBlog, login, register, singleCommentbyItsId, updateComment, updatePost } from "../controller/controller.js";
import { authUser } from "../middleware/authUser.js";
import { isAdmin } from "../middleware/isAdmin.js";
const router=express.Router();

        //user routes

router.post('/register',register);
router.post('/login',login);
router.post('/create-blog',authUser,createBlog);
router.post('/like/:_id',authUser,likeBlog);   //_id =>blog id
router.delete('/delete/:_id',authUser,deleteBlog);  //_id ==> blog id
router.get('/getAllblogs',authUser,getBlogs);   //returns ALL BLOGS
//comments
router.post('/comment/:_id',authUser,commentBlog); //_id ==>blogid
router.get('/getCommentOfPost/:_id',authUser,getCommentsOfaPost);   //returns all the comments of particular blog{_id}
router.get('/blogById/:_id',authUser,isAdmin,blogofParticularUser) //Blog of particular user{_id}
router.get('/singlecomment/:_id',authUser,isAdmin,singleCommentbyItsId);  //  {_id}==> comment id
    //returns single comment using comment id
router.delete('/deleteall',authUser,isAdmin,deleteAllBlogsByAdmin);
router.delete('/deletecomment/:_id',authUser,deletecomment);
router.delete('/deleteallcomments/:_id',authUser,isAdmin,deleteallcommentsofaBlog);

router.put('/updatePost/:_id',authUser,updatePost);
router.put('/updatecomment/:_id',authUser,updateComment);
export default router