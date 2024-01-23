import mongoose from 'mongoose';
import { commentSchema } from './comment.schema.js';
import { ObjectId } from 'mongodb';
import { userSchema } from '../users/user.schema.js';
import { postSchema } from '../posts/post.schema.js';

const commentModel = mongoose.model('comment',commentSchema);
const userModel = mongoose.model('users',userSchema);
const postModel = mongoose.model('posts',postSchema);


export class CommentRepository{
    
    async get(userID,postID){
        try{
            return await commentModel.find({user: new ObjectId(userID), post: new ObjectId(postID)}); 
        }catch(err){
            console.log(err);
        }
    }

    async create(userID,postID,comment){
        try{
            const commment = new commentModel({user:new ObjectId(userID), comment:comment, post:new ObjectId(postID)})
            const savedComment = await commment.save();
            //Update user
            const user = await userModel.findById(userID);
            user.comments.push(savedComment._id);
            await user.save();
            //update post
            const post = await postModel.findById(postID);
            post.comments.push(savedComment._id);
            await post.save();

            return savedComment;
        }catch(err){
            console.log(err);
        }
    }

    async delete(userID,commentID){
        try{
            const comment = await commentModel.findOne({_id:new ObjectId(commentID), user:new ObjectId(userID)});
            if(comment){
                await commentModel.deleteOne({_id: new ObjectId(commentID),user:new ObjectId(userID)});
                //Deleting form userModel
                const user = await userModel.findOne({_id:new ObjectId(userID)});
                user.comments.pull(commentID);
                await user.save();
                //Deleting from postModel
                // console.log(comment.post);
                const post = await postModel.findOne({_id:new ObjectId(comment.post)});
                post.comments.pull(commentID);
                await post.save();

                return 'Comment deleted succesful';
            }else{
                //check if user is the post owner if yes let him del
                const comment = await commentModel.findOne({_id:new ObjectId(commentID)});
                // console.log(comment);
                const user = await userModel.findOne({_id:new ObjectId(userID),posts:{$in:[new ObjectId(comment.post)]}});
                if(user){
                    console.log('Deletion by owner of the post');
                    await commentModel.deleteOne({_id: new ObjectId(commentID)});
                    //Deleting form userModel
                    const user = await userModel.findOne({_id:new ObjectId(comment.user)});
                    user.comments.pull(commentID);
                    await user.save();
                    //Deleting from postModel
                    const post = await postModel.findOne({_id:new ObjectId(comment.post)});
                    post.comments.pull(commentID);
                    await post.save();
                    return 'Comment deleted succesful by owner of the post';
                }else{
                    return 'Comment not found to delete';
                }
            }
        }catch(err){
            console.log(err);
        }
    }

    async update(userID,commentID,comment){
        try{
            const updateComment = await commentModel.findOne({_id:new ObjectId(commentID), user:new ObjectId(userID)});
            if(updateComment){
                updateComment.comment=comment;
                return await updateComment.save();
            }else{
                return 'comment not found to update';
            }
        }catch(err){
            console.log(err);
        }
    }


}