import mongoose from "mongoose";

export const likeSchema = new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId, ref:"users"},
    //Stroes the object id of the object we have liked, can be product or cateogry
    likeable:{
        type:mongoose.Schema.Types.ObjectId,
        //'on_model' will be separate attr which specify 'which type' of object can appear in likable
        refPath:'on_model'
    },
    on_model:{
        type:String,
        enum:['posts','comments']
    }
})