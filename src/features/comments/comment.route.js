import express from 'express'
import jwtAuth from '../../middlewares/auth.middleware.js';
import blacklistedToken from '../../middlewares/blacklistedToken.middleware.js';
import blacklistedAllToken from '../../middlewares/blacklistAll.middleware.js';
import { CommentController } from './comment.controller.js';

var commentControl = new CommentController();
const commentRouter = express.Router();

commentRouter.get('/:postId',jwtAuth,blacklistedAllToken,blacklistedToken,(req,res,next)=>{
    commentControl.getCommentByPostId(req,res,next);
});
commentRouter.post('/:postId',jwtAuth,blacklistedAllToken,blacklistedToken,(req,res,next)=>{
    commentControl.createCommentByPostId(req,res,next);
});
commentRouter.delete('/:commentId',jwtAuth,blacklistedAllToken,blacklistedToken,(req,res,next)=>{
    commentControl.deleteCommentByCommentId(req,res,next);
});
commentRouter.put('/:commentId',jwtAuth,blacklistedAllToken,blacklistedToken,(req,res,next)=>{
    commentControl.updateCommentByCommentId(req,res,next);
});

export default commentRouter;