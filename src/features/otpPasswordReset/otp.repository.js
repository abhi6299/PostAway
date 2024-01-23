import mongoose from 'mongoose';
import { userSchema } from '../users/user.schema.js';
import { otpSchema } from './otp.schema.js';
import { ObjectId } from 'mongodb';

const userModel = mongoose.model('User',userSchema);
const otpModel = mongoose.model('otp',otpSchema);
export class OtpRepository{

    async find(id){
        try{
            return await userModel.findOne({_id:new ObjectId(id)});
        }catch(err){
            console.log(err);
                // throw new ApplicationError("Something went wrong in signup database",500);
        }
    }

    async resetPswd(userID,newPswd){
        try{
            //Updating User Schema
            let user = await userModel.findById(userID);
            if(user){
                user.password = newPswd;
                await user.save();
            }else{
                return "No such user found";
            }
            //Updating otpUser schema
            let otpUser = await otpModel.findOne({user: new ObjectId(userID)});
            if(otpUser){
                otpUser.password = newPswd;
                await otpUser.save();
            }else{
                const newotpUser = new otpModel({user:userID,password:newPswd});
                await newotpUser.save();
            }
        }catch(err){
            console.log(err);
            // if(err instanceof mongoose.Error.ValidationError){
            //     throw err;
            // }
            // else{
            //     throw new ApplicationError("Something went wrong in signup database",500);
            // }
        }
    }

}