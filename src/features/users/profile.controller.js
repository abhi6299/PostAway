// import UserModel from "./user.model.js";
// import { ApplicationError } from "../../../error-handler/applicationError.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import { userSchema } from './user.schema.js';
import { UserProfileRepository } from './profile.repository.js';
const userModel = mongoose.model('User',userSchema);

export class UserProfileController {

    constructor(){
        this.userProfileRepository = new UserProfileRepository();
    }

    async getUserDetials(req,res,next){
        try{
            const userId = req.params.userId; 
            const newUser = await this.userProfileRepository.getDetailById(userId);
            res.status(201).send(newUser);
        }catch(err){
            console.log(err);
            res.status(400).send('Error occured while registered the user');
        }
    }
    async getAllUserDetials(req,res,next){
        try{
            const newUser = await this.userProfileRepository.getAll();
            res.status(201).send(newUser);
        }catch(err){
            console.log(err);
            res.status(400).send('Error occured while registered the user');
        }
    }

    async updateDetails(req,res,next){
        try{
            const userID = req.params.userId;
            let name = undefined;
            let avatar = undefined;
            let gender = undefined;
            if(req.body.name){
                name = req.body.name;
            }
            if(req.body.gender){
                gender = req.body.gender;
            }
            if(req.file){
                avatar = req.file.filename;
            }
            const newUser = await this.userProfileRepository.update(userID,name,gender,avatar);
            res.status(201).send(newUser);
        }catch(err){
            console.log(err);
            res.status(400).send('Error occured while registered the user');
        }
    }
}