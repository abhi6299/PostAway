import express from 'express'
import { UserController } from './user.controller.js';
import jwtAuth from '../../middlewares/auth.middleware.js';
import blacklistedToken from '../../middlewares/blacklistedToken.middleware.js';
import blacklistedAllToken from '../../middlewares/blacklistAll.middleware.js';
import { UserProfileController } from './profile.controller.js';
import { upload } from '../../middlewares/file-upload.middleware.js';

var userControl = new UserController();
var userProfileControl = new UserProfileController();
const userRouter = express.Router();

userRouter.post('/register',upload.single('avatar'),(req,res,next)=>{
    userControl.register(req,res,next);
});
userRouter.post('/login',(req,res,next)=>{
    userControl.login(req,res,next);
});
userRouter.get('/logout',jwtAuth,blacklistedAllToken,blacklistedToken,(req,res,next)=>{
    userControl.logout(req,res,next);
});
userRouter.get('/logout-all-devices',jwtAuth,blacklistedAllToken,blacklistedToken,(req,res,next)=>{
    userControl.logoutAll(req,res,next);
});

//user-profile routes

userRouter.get('/get-details/:userId',jwtAuth,blacklistedAllToken,blacklistedToken,(req,res,next)=>{
    userProfileControl.getUserDetials(req,res,next);
});
userRouter.get('/get-all-details',jwtAuth,blacklistedAllToken,blacklistedToken,(req,res,next)=>{
    userProfileControl.getAllUserDetials(req,res,next);
});
userRouter.post('/update-details/:userId',jwtAuth,blacklistedAllToken,blacklistedToken,upload.single('avatar'),(req,res,next)=>{
    userProfileControl.updateDetails(req,res,next);
});

export default userRouter;