import express from 'express'
import { otpController } from './otp.controller.js';
import blacklistedToken from '../../middlewares/blacklistedToken.middleware.js';
import blacklistedAllToken from '../../middlewares/blacklistAll.middleware.js';
import jwtAuth from '../../middlewares/auth.middleware.js';

var otpControl = new otpController();
const otpRouter = express.Router();

otpRouter.get('/send',jwtAuth,blacklistedAllToken,blacklistedToken,(req,res,next)=>{
    otpControl.sendOTP(req,res,next);
});
otpRouter.post('/verify',jwtAuth,blacklistedAllToken,blacklistedToken,(req,res,next)=>{
    otpControl.verifyOTP(req,res,next);
});
otpRouter.post('/reset-password',jwtAuth,blacklistedAllToken,blacklistedToken,(req,res,next)=>{
    otpControl.resetPassword(req,res,next);
});

export default otpRouter;