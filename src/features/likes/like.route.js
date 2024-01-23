import express from 'express'
import jwtAuth from '../../middlewares/auth.middleware.js';
import blacklistedToken from '../../middlewares/blacklistedToken.middleware.js';
import blacklistedAllToken from '../../middlewares/blacklistAll.middleware.js';
import { likeController } from './like.controller.js';

var likeControl = new likeController();
const likeRouter = express.Router();

likeRouter.get('/:id',jwtAuth,blacklistedAllToken,blacklistedToken,(req,res,next)=>{
    likeControl.getLike(req,res,next);
});
likeRouter.post('/toggle/:id',jwtAuth,blacklistedAllToken,blacklistedToken,(req,res,next)=>{
    likeControl.toggleLike(req,res,next);
});

export default likeRouter;