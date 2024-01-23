import f from 'fs';
import winston from 'winston';

const fsPromise = f.promises;

// function to log data in text file
export async function log(logData){
    try{
        logData = `\n ${new Date().toString()}. LogData: ${logData}`; // good to attach timestamp to log
        await fsPromise.appendFile('requestLog.log',logData); //writing logData to filepath
    }catch{
        console.log(err);
    }
}
export async function loggerError(logData){
    try{
        logData = `\n ${new Date().toString()}. LogData: ${logData}`; // good to attach timestamp to log
        await fsPromise.appendFile('Errors.log',logData); //writing logData to filepath
    }catch{
        console.log(err);
    }
}

// Implementing logger via library - winston
// const logger = winston.createLogger({
//     level:'info',
//     format: winston.format.json(),
//     defaultMeta: {service: 'request-logging'},
//     transports:[
//         new winston.transports.File({filename:'logviaWinston.txt'})
//     ]
// });

const logsMiddleware = async (req,res,next) => {
    if(req.url.includes('login')){
        next();
    }else{
        const x = `${req.url} - ${JSON.stringify(req.body)}`;
        await log(x);
        //When using winston -
            // logger.info(x);
        next();
    }
}

export default logsMiddleware;