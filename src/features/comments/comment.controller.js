import { CommentRepository } from "./comment.repository.js";

export class CommentController{

    constructor(){
        this.commentRepository = new CommentRepository();
    }

    async getCommentByPostId(req,res,next){
        try{
            const userID = req.userID;
            const postID = req.params.postId;
            const comments = await this.commentRepository.get(userID,postID);
            res.status(200).send(comments);
        }catch(err){
            console.log(err);
            res.status(400).send('Error occured while fetching comment by PostId');
        }
    }

    async createCommentByPostId(req,res,next){
        try{
            const {comment} = req.body;
            const userID = req.userID;
            const postID = req.params.postId;
            const comments = await this.commentRepository.create(userID,postID,comment);
            res.status(200).send(comments);
        }catch(err){
            console.log(err);
            res.status(400).send('Error occured while fetching comment by PostId');
        }
    }

    async deleteCommentByCommentId(req,res,next){
        try{
            const userID = req.userID;
            const commentId = req.params.commentId;
            const comments = await this.commentRepository.delete(userID,commentId);
            res.status(200).send(comments);
        }catch(err){
            console.log(err);
            res.status(400).send('Error occured while fetching comment by PostId');
        }
    }
    async updateCommentByCommentId(req,res,next){
        try{
            const {comment} = req.body;
            const commentId = req.params.commentId;
            const userID= req.userID;
            const updatedComment = await this.commentRepository.update(userID,commentId,comment);
            res.status(200).send(updatedComment);
        }catch(err){
            console.log(err);
            res.status(400).send('Error occured while fetching comment by PostId');
        }
    }

}