import mongoose from 'mongoose';

export const otpSchema = new mongoose.Schema({
    user:{type: mongoose.Schema.Types.ObjectId, ref:'user'},
    password:{type:String, ref:'user'}
})