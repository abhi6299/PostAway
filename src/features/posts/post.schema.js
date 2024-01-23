import mongoose from 'mongoose';

export const postSchema = new mongoose.Schema({
    imageUrl:String,
    caption:String,
    user:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    comments:[{type:mongoose.Schema.Types.ObjectId, ref:'comments'}],
    likes:[{type:mongoose.Schema.Types.ObjectId, ref:'likes'}]
})