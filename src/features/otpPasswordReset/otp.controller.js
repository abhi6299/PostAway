import { UserController } from "../users/user.controller.js";
import { OtpRepository } from "./otp.repository.js";
import * as nodemailer from 'nodemailer';
import otpGenerator from 'otp-generator';
import bcrypt from 'bcrypt';
import { UserRepository } from "../users/user.repository.js";

async function sendMail(OTP,email) {
    //Creating an email transporter

    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth: {
            user:'abhinav6299goyal@gmail.com',
            pass: 'pqghqvszmsmnhuqi'
        }
    })
    //Configure email content
    const mailOption = {
        from:'abhinav6299goyal@gmail.com',
        to:`${email}`,
        subject:'Password reset from nodejsApp',
        text:`OTP is : ${OTP}`
    }
    //Send email
    try{
        const result = await transporter.sendMail(mailOption);
        console.log('Email sent successfully');
        return result;
    }catch(err){
        console.log('Email send unsuccessful with error: ',err);
    }
    //OR -------------------
    //Another way to send mail with defined transport object
    //  
}
var OTP = '';
export class otpController{

    constructor(){
        this.otpRepository = new OtpRepository();
        this.userRepository = new UserRepository();
    }

    async sendOTP(req,res,next){
        try{
            //Generating OTP
            const userID = req.userID;
            const findUser = await this.otpRepository.find(userID);
            if(!findUser){
                res.status(400).send('Invalid Email');
            }
            OTP = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
            const result = sendMail(OTP,findUser.email);
            res.status(200).send('Email sent successfully');
        }catch(err){
            console.log(err);
            res.status(400).send('Error occured while sending OTP');
        }
    }

    async verifyOTP(req,res,next){
        try{
            const otp = req.body.otp;
            if(otp ==  OTP){
                res.status(200).send("OTP verified successfully, Please conitnue to reset your password");
            }else{
                // console.log("OTP-",OTP);
                // console.log("otp-",otp);
                res.status(200).send("OTP verified Un-successfully, Please provide correct otp");
            }
        }catch(err){
            console.log(err);
            res.status(400).send('Error occured while verifying OTP');
        }
    }
    // $2b$12$cvXRxeb4fTfSUHAhSODr/u4kwGyI/O2oF7X5lMFXt4QIWhAkR34xK
    async resetPassword(req,res,next){
        try{
            const userID = req.userID;
            const {password} = req.body;
            const hashedpswd = await bcrypt.hash(password,12);    
            await this.otpRepository.resetPswd(userID,hashedpswd);
            
            //Logging out of all devices now
            const token = req.headers["authorization"];
            const findUser = await this.otpRepository.find(userID);
            findUser.blacklistToken='';
            findUser.blacklistAll=[];
            await findUser.save();
            await this.userRepository.setToken(userID,token);

            // console.log(userID,token);
            await this.userRepository.blacklistAll(userID);

            res.status(200).send('Password reset successful- You are logged out of ALL devices, please login again with the new pswd');
        }catch(err){
            console.log(err);
            res.status(400).send('Error occured resetting the password');
        }
    }
}