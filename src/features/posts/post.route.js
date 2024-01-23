import express from 'express'
import jwtAuth from '../../middlewares/auth.middleware.js';
import blacklistedToken from '../../middlewares/blacklistedToken.middleware.js';
import blacklistedAllToken from '../../middlewares/blacklistAll.middleware.js';
import { upload } from '../../middlewares/file-upload.middleware.js';
import { PostController } from './post.controller.js';

var postControl = new PostController();
const postRouter = express.Router();
//Fetching post variations
postRouter.get('/all',jwtAuth,blacklistedAllToken,blacklistedToken,(req,res,next)=>{
    postControl.getAllPost(req,res,next);
});
postRouter.get('/',jwtAuth,blacklistedAllToken,blacklistedToken,(req,res,next)=>{
    postControl.getAllPostByUserId(req,res,next);
});
postRouter.get('/:postId',jwtAuth,blacklistedAllToken,blacklistedToken,(req,res,next)=>{
    postControl.getPostByPostId(req,res,next);
});
postRouter.post('/',jwtAuth,blacklistedAllToken,blacklistedToken,upload.single('imageUrl'),(req,res,next)=>{
    postControl.createPost(req,res,next);
});
postRouter.delete('/:postId',jwtAuth,blacklistedAllToken,blacklistedToken,(req,res,next)=>{
    postControl.deletePost(req,res,next);
});
postRouter.put('/:postId',jwtAuth,blacklistedAllToken,blacklistedToken,upload.single('imageUrl'),(req,res,next)=>{
    postControl.updatePost(req,res,next);
});

export default postRouter;