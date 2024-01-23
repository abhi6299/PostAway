import mongoose from 'mongoose';
import { postSchema } from './post.schema.js';
import { ObjectId } from 'mongodb';
import { userSchema } from '../users/user.schema.js';

const postModel = mongoose.model('post',postSchema);
const userModel = mongoose.model('user',userSchema);

export class PostRepository{

    async getAll(){
        try{
            return await postModel.find();
        }catch(err){
            console.log(err);
        }
    }

    async getByPostId(postID){
        try{
            return await postModel.findById(postID);
        }catch(err){
            console.log(err);
        }
    }

    async getByUserId(userID){
        try{
            return await postModel.find({user:new ObjectId(userID)});
        }catch(err){
            console.log(err);
        }
    }
    async create(userID,caption,imageUrl){
        try{
            const post = new postModel({user:new ObjectId(userID), caption:caption, imageUrl:imageUrl})
            const savedPost = await post.save();
            const user = await userModel.findById(userID);
            user.posts.push(savedPost._id);
            await user.save();
            return savedPost;
        }catch(err){
            console.log(err);
        }
    }
    async delete(postID,userID){
        try{
            const post = await postModel.findOne({_id:new Object(postID), user:new ObjectId(userID)});
            if(post){
                await postModel.deleteOne({_id: new Object(postID),user:new ObjectId(userID)});
                const user = await userModel.findOne({_id:new Object(userID)});
                user.posts.pull(postID);
                await user.save();
                return 'Post deleted succesful';
            }else{
                return 'post not found to delete';
            }
        }catch(err){
            console.log(err);
        }
    }
    async update(userID,postID,caption,imageUrl){
        try{
            const post = await postModel.findOne({_id:new Object(postID), user:new ObjectId(userID)});
            if(post){
                if(caption != undefined){
                    post.caption=caption;
                }
                if(imageUrl != undefined){
                    post.imageUrl = imageUrl;
                }
                const savedPost=await post.save();
                return savedPost;
            }else{
                return 'post not found to update';
            }
        }catch(err){
            console.log(err);
        }
    }

}