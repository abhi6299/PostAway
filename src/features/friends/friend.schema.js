import mongoose from 'mongoose';

export const friendSchema = new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId, ref:'user'},
    status:{type:String, enum:['pending','friend','reject']},
    friendId: {type:mongoose.Schema.Types.ObjectId, ref:'user'},
})