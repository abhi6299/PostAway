import mongoose from 'mongoose';
import { likeSchema } from './like.schema.js';
import { ObjectId } from 'mongodb';
import { commentSchema } from '../comments/comment.schema.js';
import { postSchema } from '../posts/post.schema.js';

const likeModel = mongoose.model('likes',likeSchema);
const commentModel = mongoose.model('comments',commentSchema);
const postModel = mongoose.model('posts',postSchema);

export class LikeRepository{

    async get(id){
        try{
            return await likeModel.find({likeable:new ObjectId(id)});
        }catch(err){
            console.log(err);
        }
    }

    async toggle(userID,id){
        try{
            const like = await likeModel.findOne({user:new ObjectId(userID),likeable:new mongoose.Types.ObjectId(id)});
            const post = await postModel.findById(id);
            const comment = await commentModel.findById(id);
            if(like){
                console.log('Inside when like is found');
                //present, so toggle it i.e remove(del it) it
                if(post){
                    post.likes.pull(like._id);
                    await post.save();
                    console.log('Inside post');
                }
                if(comment){
                    comment.likes.pull(like._id);
                    await comment.save();
                    console.log('Inside comment');
                }
                const deleted = await likeModel.deleteOne({user:new ObjectId(userID),likeable:new mongoose.Types.ObjectId(id)});
                if(deleted){
                    return 'Like Toggled- deleted'
                }else{
                    return 'Like not toggled as it should be the original user who like to toggle the like'
                }
            }else{
                console.log('Inside when like is not found');
                //add a like
                let model = '';
                if(post){
                    model="posts";
                }
                if(comment){
                    model="comments";
                }
                const newLike = new likeModel({user:new ObjectId(userID),likeable:new ObjectId(id),on_model:model});
                const savedLike = await newLike.save();
                //Adding same like to post 
                if(model == 'posts'){
                    console.log('Inside post');
                    post.likes.push(savedLike._id);
                    await post.save();
                }
                if(model == 'comments'){
                    console.log('Inside comment');
                    comment.likes.push(savedLike._id);
                    await comment.save();
                }
                return savedLike;
            }
        }catch(err){
            console.log(err);
        }
    }

}