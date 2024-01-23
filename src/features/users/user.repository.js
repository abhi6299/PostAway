import mongoose from 'mongoose';
import { userSchema } from './user.schema.js';
import { ObjectId } from 'mongodb';

const userModel = mongoose.model('User',userSchema);

export class UserRepository{

    async register(name,email,password,gender,avatar,blacklisttoken){
        try{
            const newUser = new userModel({name:name, email:email, password:password, gender:gender,avatar, blacklistToken:blacklisttoken});
            const savedUser = await newUser.save();
            return savedUser;
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

    async findByEmail(email){
        try{
            return await userModel.findOne({email});
        }catch(err){
            console.log(err);
                // throw new ApplicationError("Something went wrong in signup database",500);
        }
    }
    async setToken(id,token){
        try{
            const user = await userModel.findOneAndUpdate({_id:new ObjectId(id)},{blacklistToken:token},{new:true});
            const savedToken=await user.save();
            return savedToken;

        }catch(err){
            console.log(err);
        }
    }
    async blacklistAll(id){
        try{
            const user = await userModel.findOne({ _id: new ObjectId(id) }); // Fetch the user document
                const tokensToAdd = user.listofTokens || []; // Get the listofTokens array from the user or an empty array if it's null/undefined
                const updatedUser = await userModel.updateOne(
                    { _id: new ObjectId(id) },
                    {
                        $addToSet: { blacklistAll: { $each: tokensToAdd } }, // Add the tokens to blacklistAll using $addToSet and $each
                        $set: { listofTokens: [] } // Clear the listofTokens array
                    }
                );

                // console.log("Updated user:", updatedUser);
            // const savedUser = await updatedUser.save();
            return updatedUser;
        }catch(err){
            console.log(err);
        }
    }

}