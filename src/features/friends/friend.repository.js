import mongoose from 'mongoose';
import { friendSchema } from './friend.schema.js';
import { ObjectId } from 'mongodb';
import { userSchema } from '../users/user.schema.js';

const friendModel = mongoose.model('friends',friendSchema);
const userModel = mongoose.model('users',userSchema);

export class FriendRepository{

    async getFriends(userId){
        try{
            return await friendModel.find({user:new mongoose.Types.ObjectId(userId), status:'friend'})
        }catch(err){
            console.log(err);
        }
    }

    async pending(userID){
        try{
            return await friendModel.find({user:new mongoose.Types.ObjectId(userID), status:'pending'})
        }catch(err){
            console.log(err);
        }
    }

    async toggle(friendID,userID,status){
        try{
            const friend = await friendModel.findOne({user:new mongoose.Types.ObjectId(userID), friendId:new ObjectId(friendID)});
            if(friend){
                if(friend.status == status){
                    return 'The friend status already is '+ status;
                }else{
                    let temp = '';
                    let oldStatus=friend.status;
                    friend.status=status;
                    const newStatus = await friend.save();

                    if(oldStatus == 'reject' && status == 'pending'){
                        const user = await userModel.findById(userID);
                        user.rejectFriendRequests.pull(friendID);
                        user.pendingFriendRequests.push(friendID);
                        await user.save();
                        temp= 'Toggled friend from Reject to Pending status';
                    }else if(oldStatus == 'reject' && status == 'friend'){
                        const user = await userModel.findById(userID);
                        user.rejectFriendRequests.pull(friendID);
                        user.friends.push(friendID);
                        await user.save();

                        const friend = await userModel.findById(friendID);
                        friend.friends.push(userID);
                        await friend.save();
                        temp= 'Toggled friend from Reject to Friend status';
                    }
                    else if(oldStatus == 'pending' && status == 'friend'){
                        const user = await userModel.findById(userID);
                        user.pendingFriendRequests.pull(friendID);
                        user.friends.push(friendID);
                        await user.save();

                        const friend = await userModel.findById(friendID);
                        friend.friends.push(userID);
                        await friend.save();
                        temp= 'Toggled friend from Pending to Friend status';

                    }else if(oldStatus == 'friend' && status == 'reject'){
                        const user = await userModel.findById(userID);
                        user.friends.pull(friendID);
                        user.rejectFriendRequests.push(friendID);
                        await user.save();

                        const friend = await userModel.findById(friendID);
                        friend.friends.pull(userID);
                        await friend.save();

                        temp= 'Toggled friend from Friend to Reject status';
                    }

                    return {resp:newStatus, status:temp};
                }
            }else{
                return 'No friend found to toggle the friendship';
            }
        }catch(err){
            console.log(err);
        }
    }

    async respond(friendID,userID,status){
        try{
            const newFriend = new friendModel({user:new ObjectId(userID),friendId:new ObjectId(friendID),status:status});
            const savedNewFrind = await newFriend.save();
            //Updating in userSchema
            if(status == 'pending'){
                //update user list of pending frinedRequests
                const user = await userModel.findById(userID);
                user.pendingFriendRequests.push(friendID);
                await user.save();
            }
            else if(status == 'friend'){
                //update in both user frinds array
                const user = await userModel.findById(userID);
                user.friends.push(friendID);
                await user.save();

                const friend = await userModel.findById(friendID);
                friend.friends.push(userID);
                await friend.save();
            }
            else if(status == 'reject'){
                const user = await userModel.findById(userID);
                user.rejectFriendRequests.push(friendID);
                await user.save();
            }
            return savedNewFrind;
        }catch(err){
            console.log(err);
        }
    }

}