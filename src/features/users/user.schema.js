import mongoose from 'mongoose';

export const userSchema = new mongoose.Schema({
    name:{type:String, required:true, maxLength: 25},
    email: {type: String, required:true,
        match: [/.+\@.+\../,"Please enter a valid email"]   },
    password:{type:String},
    gender:String,
    avatar:String,
    blacklistToken:{type:String},
    listofTokens:[{type:String}],
    blacklistAll:[{type:String}],
    posts:[{type:mongoose.Schema.Types.ObjectId, ref:'posts'}],
    comments:[{type:mongoose.Schema.Types.ObjectId, ref:'comments'}],
    friends:[{type:mongoose.Schema.Types.ObjectId, ref:'friends'}],
    pendingFriendRequests:[{type:mongoose.Schema.Types.ObjectId, ref:'friends'}],
    rejectFriendRequests:[{type:mongoose.Schema.Types.ObjectId, ref:'friends'}]
})