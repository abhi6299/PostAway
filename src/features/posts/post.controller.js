import { PostRepository } from "./post.repository.js";

export class PostController{
    
    constructor(){
        this.postRepository = new PostRepository();
    }

    async getAllPost(req,res,next){
        try{
            const allPosts = await this.postRepository.getAll();
            res.status(200).send(allPosts);
        }catch(err){
            console.log(err);
            res.status(400).send('Error occured while fetching ALL Post');
        }
    }

    async getPostByPostId(req,res,next){
        try{
            const postID = req.params.postId;
            const PostByPostId = await this.postRepository.getByPostId(postID);
            res.status(200).send(PostByPostId);
        }catch(err){
            console.log(err);
            res.status(400).send('Error occured while fetching Post by PostId');
        }
    }
    
    async getAllPostByUserId(req,res,next){
        try{
            const userID=req.userID;
            const PostByUserID = await this.postRepository.getByUserId(userID);
            res.status(200).send(PostByUserID);
        }catch(err){
            console.log(err);
            res.status(400).send('Error occured while fetching ALL Post of particular user by userID');
        }
    }

    async createPost(req,res,next){
        try{
            const userID=req.userID;
            const {caption} = req.body;
            let imageUrl = '';
            if(req.file){
                imageUrl = req.file.filename;
            }
            const createdPost = await this.postRepository.create(userID,caption,imageUrl);
            res.status(200).send(createdPost);
        }catch(err){
            console.log(err);
            res.status(400).send('Error occured while creating a Post');
        }
    }
    async deletePost(req,res,next){
        try{
            const userID = req.userID;
            const postID = req.params.postId;
            const deletedPost = await this.postRepository.delete(postID,userID);
            res.status(200).send(deletedPost);
        }catch(err){
            console.log(err);
            res.status(400).send('Error occured while deleting a Post');
        }
    }
    async updatePost(req,res,next){
        try{
            const userID= req.userID
            const postID = req.params.postId;
            let caption = undefined;
            let imageUrl = undefined;
            if(req.body.caption){
                caption = req.body.caption;
            }
            if(req.file){
                imageUrl = req.file.filename;
            }
            const updatedPost = await this.postRepository.update(userID,postID,caption,imageUrl);
            res.status(200).send(updatedPost);
        }catch(err){
            console.log(err);
            res.status(400).send('Error occured while updating a post');
        }
    }
    
}