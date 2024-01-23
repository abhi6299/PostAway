import { LikeRepository } from "./like.repository.js";

export class likeController{

    constructor(){
        this.likeRepository = new LikeRepository();
    }

    async getLike(req,res,next){
        try{
            const id = req.params.id;
            const like = await this.likeRepository.get(id);
            res.status(200).send(like);
        }catch(err){
            console.log(err);
            res.status(400).send('Error occured while fetching like');        
        }
    }

    async toggleLike(req,res,next){
        try{
            const id = req.params.id;
            const userID = req.userID;
            const like = await this.likeRepository.toggle(userID,id);
            res.status(200).send({ msg:'Toggled status',response:like });
        }catch(err){
            console.log(err);
            res.status(400).send('Error occured while toggling like');        
        }
    }

}