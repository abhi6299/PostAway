import mongoose from 'mongoose';

export const commentSchema = new mongoose.Schema({
    comment:String,
    post:{type:mongoose.Schema.Types.ObjectId, ref:'posts'},
    user:{type:mongoose.Schema.Types.ObjectId, ref:'user'},
    likes:[{type:mongoose.Schema.Types.ObjectId, ref:'likes'}]
})