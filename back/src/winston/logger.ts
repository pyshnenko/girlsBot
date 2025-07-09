var appRoot = require('app-root-path');
import winston from "winston";
import winstonOptions from "@/winston/config";

export const logger = new winston.Logger({
    transports: [
        new winston.transports.File(winstonOptions.file),
        new winston.transports.Console(winstonOptions.console)
    ],
    exitOnError: false
});