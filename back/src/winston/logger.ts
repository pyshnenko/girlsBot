var appRoot = require('app-root-path');
import winston from "winston";
import winstonOptions from "@/winston/apiConfig";
import botConfig from "./botConfig";

export const logger = new winston.Logger({
    transports: [
        new winston.transports.File(winstonOptions.errfile),  
        new winston.transports.File(winstonOptions.fileDebug),  
        new winston.transports.File(winstonOptions.fileInfo),  
        new winston.transports.Console(winstonOptions.consoleDebug),  
        new winston.transports.Console(winstonOptions.consoleInfo),  
    ],
    exitOnError: false
});

export const botLogger = new winston.Logger({
    transports: [
        new winston.transports.File(botConfig.errfile),  
        new winston.transports.File(botConfig.fileDebug),  
        new winston.transports.File(botConfig.fileInfo),  
        new winston.transports.Console(botConfig.consoleDebug),  
        new winston.transports.Console(botConfig.consoleInfo),  
    ],
    exitOnError: false
})