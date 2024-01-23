import { ObjectId } from 'mongodb';
import { userSchema } from '../features/users/user.schema.js';
import mongoose from 'mongoose';
const userModel = new mongoose.model('User',userSchema);


const blacklistedAllToken = async (req,res,next) => {

    const token = req.headers["authorization"];
    try{
        const user = await userModel.findOne({
            _id: new ObjectId(req.userID),
            listofTokens: { $in: [token] }, // Check if the token exists in listofTokens array
            blacklistedToken: { $nin: [token] } // Check if the token doesn't exist in blacklistedToken array
        });
    
        if (user) {
            // Token is in listofTokens and not in blacklistedToken, allow access
            // console.log("GOing to next");
            next();
        }
        else{
            return res.status(401).send('You are logged out from all devices, Please login again to generate new token');
        }
    }catch(err){
        console.log(err);
        return res.status(401).send('Unauthorized access for the user while logging out- in blacklist middleware');
    }
}

export default blacklistedAllToken;