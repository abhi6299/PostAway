import mongoose from 'mongoose';
import { userSchema } from './user.schema.js';
import { ObjectId } from 'mongodb';

const userModel = mongoose.model('User',userSchema);

export class UserProfileRepository{

    async getDetailById(id){
        try{
            const getUser = await userModel.findOne({_id:new ObjectId(id)}).select('name email gender avatar');
            return getUser;
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
    async getAll(){
        try{
            const getUsers = await userModel.find().select('name email gender avatar');;
            return getUsers;
        }catch(err){
            console.log(err);
            if(err instanceof mongoose.Error.ValidationError){
                throw err;
            }
            else{
                throw new ApplicationError("Something went wrong in signup database",500);
            }
        }
    }
    async update(userID,name,gender,avatar){
        const user = await userModel.findOne({_id : new Object(userID)});
        if(name != undefined){
            user.name =  name;
        }
        if(gender != undefined){
            user.gender = gender;
        }
        if(avatar != undefined){
            user.avatar = avatar;
        }
        const savedUser = await user.save();
        return savedUser;
    }
}