import { FriendRepository } from "./friend.repository.js";

export class friendController{

    constructor(){
        this.friendRepository = new FriendRepository();
    }

    async getFriends(req,res,next){
        try{
            const userId = req.params.userId;
            const friends = await this.friendRepository.getFriends(userId);
            res.status(200).send(friends);
        }catch(err){
            console.log(err);
            res.status(400).send('Error occured while getting list of friends');        
        }
    }
    async getPending(req,res,next){
        try{
            const userID = req.userID;
            console.log(userID);
            const pending = await this.friendRepository.pending(userID);
            res.status(200).send(pending);
        }catch(err){
            console.log(err);
            res.status(400).send('Error occured while getting list of friends');        
        }
    }
    async toggleFriend(req,res,next){
        try{
            const friendID = req.params.friendId;
            const userID = req.userID;
            const {status}=req.body;
            const toggled = await this.friendRepository.toggle(friendID,userID,status);
            res.status(200).send(toggled);
        }catch(err){
            console.log(err);
            res.status(400).send('Error occured while getting list of friends');        
        }
    }
    async respondToRequest(req,res,next){
        try{
            const friendID = req.params.friendId;
            const userID = req.userID;
            const {status}=req.body;
            const toggled = await this.friendRepository.respond(friendID,userID,status);
            res.status(200).send(toggled);
        }catch(err){
            console.log(err);
            res.status(400).send('Error occured while getting list of friends');        
        }
    }

}