import * as express from 'express';
import './env.js';
import bodyParser from 'body-parser';
import userRouter from './src/features/users/user.route.js';
import { connectUsingMongoose } from './src/config/mongoose.db.js';
import otpRouter from './src/features/otpPasswordReset/otp.route.js';
import postRouter from './src/features/posts/post.route.js';
import commentRouter from './src/features/comments/comment.route.js';
import likeRouter from './src/features/likes/like.route.js';
import friendRouter from './src/features/friends/friend.route.js';
import logsMiddleware, { loggerError } from './src/middlewares/logger.middleware.js';
import { ApplicationError } from './error-handler/applicationError.js';
import swagger from 'swagger-ui-express';
import  apiDocs from './swagger3.0.json' assert {type:'json'};

const server = express.default();

server.use(bodyParser.json());
server.use(express.urlencoded({extended:true}));

//UI using swagger 3.0.0 specifications
server.use('/apiDocs',swagger.serve,swagger.setup(apiDocs)); // serve generate UI

//Applying logger at application level
server.use(logsMiddleware);

server.use('/api/user',userRouter);
server.use('/api/otp',otpRouter);
server.use('/api/post',postRouter);
server.use('/api/comment',commentRouter);
server.use('/api/like',likeRouter);
server.use('/api/friend',friendRouter);

// server.get('/',(req,res)=>{
//     res.status(200).send("All ok");
// })
//Error handling middleware at application level
server.use((err,req,res,next)=>{
    console.log(err);
    loggerError(err); // also logging the errors
    //For handling mongoose validation err
    if(err instanceof mongoose.Error.ValidationError){
        return res.status(500).send(err.message);
    }
        // For handling user-defined errors
    if(err instanceof ApplicationError){
        // console.log(err.code, err.message);
        return res.status(err.code).send(err.message);
    }
        // For handling server errors
    res.status(500).send("Something went wrongg !");
})


server.listen(2100,()=>{
    console.log("Server is listening on Port 2100!");
    connectUsingMongoose();
})