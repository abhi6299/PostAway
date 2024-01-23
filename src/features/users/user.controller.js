// import UserModel from "./user.model.js";
// import { ApplicationError } from "../../../error-handler/applicationError.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import { UserRepository } from './user.repository.js';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import { userSchema } from './user.schema.js';
const userModel = mongoose.model('User',userSchema);
export class UserController {

    constructor(){
        this.userRepository = new UserRepository();
    }

    async register(req,res,next){
        try{
            // console.log(req.body);
            let avatar = '';
            if(req.file){
                avatar = req.file.filename;
            }
            const {name,email,password,gender}=req.body;
            const hashedpswd = await bcrypt.hash(password,12);    
            const newUser = await this.userRepository.register(name,email,hashedpswd,gender,avatar,'');
            res.status(201).send(newUser);
        }catch(err){

        }
    }

    async login(req,res,next){
        try{
            const {email,password}=req.body;
            const findUser = await this.userRepository.findByEmail(email);
            if(!findUser){
                res.status(400).send('Invalid Email');
            }
            else{
                const result = bcrypt.compare(password,findUser.password);
                if(result){
                    const token= jwt.sign({userID:findUser._id},process.env.JWT_SECRET,{
                        expiresIn: '1h',
                    })
                    // console.log("Login--",token);
                    await userModel.findOneAndUpdate({_id: new ObjectId(findUser._id)},{
                        $push: { listofTokens: token }
                    });
                    return res.status(200).send(token);
                }else{
                    res.status(400).send('Invalid Credentials');
                }
            }
        }catch(err){
            console.log(err);
            res.status(400).send('Error occured while loggin in the user');
        }
    }
    async logout(req,res,next){
        let responseSent = false; // Flag to track if a response has been sent

        try {
            const userID = req.userID;
            const token = req.headers["authorization"];

            const tokenSet = await this.userRepository.setToken(userID, token);
            console.log("Logout:", tokenSet.blacklistToken);

            responseSent = true; // Set flag indicating response has been sent
            return res.status(200).send({ message: 'Logout successful' });
        } catch (err) {
            console.log(err);
            if (!responseSent) { // Check if a response has already been sent
                return res.status(400).send('Error occurred while logging out the user');
            }
        }
    }
    async logoutAll(req,res,next){
        try{
            // Store the token in the blacklist
            console.log("Blacklist all function");
            const userID = req.userID;
            const token = req.headers["authorization"];

            const user = await userModel.findOne({_id: new ObjectId(userID)});
            user.blacklistToken='';
            user.blacklistAll=[];
            await user.save();
            await this.userRepository.setToken(userID,token);

            // console.log(userID,token);
            const tokenSet = await this.userRepository.blacklistAll(userID);
            return res.status(200).json({ message: 'All Logout successful' });
        }catch(err){
            console.log(err);
            return res.status(400).send('Error occured while loggin out All the user');
        }
    }
}