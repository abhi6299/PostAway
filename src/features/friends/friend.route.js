import express from 'express'
import jwtAuth from '../../middlewares/auth.middleware.js';
import blacklistedToken from '../../middlewares/blacklistedToken.middleware.js';
import blacklistedAllToken from '../../middlewares/blacklistAll.middleware.js';
import { friendController } from './friend.controller.js';

var friendControl = new friendController();
const friendRouter = express.Router();

friendRouter.get('/get-friends/:userId',jwtAuth,blacklistedAllToken,blacklistedToken,(req,res,next)=>{
    friendControl.getFriends(req,res,next);
});
friendRouter.get('/get-pending-requests',jwtAuth,blacklistedAllToken,blacklistedToken,(req,res,next)=>{
    friendControl.getPending(req,res,next);
});
friendRouter.put('/toggle-friendship/:friendId',jwtAuth,blacklistedAllToken,blacklistedToken,(req,res,next)=>{
    friendControl.toggleFriend(req,res,next);
});
friendRouter.post('/response-to-request/:friendId',jwtAuth,blacklistedAllToken,blacklistedToken,(req,res,next)=>{
    friendControl.respondToRequest(req,res,next);
});

export default friendRouter;