import { format } from 'winston';
const { combine, timestamp, json } = format;

export const file = {
    handleExceptions: true,
    json: true,
    maxsize: 10*1024*1024, // 10MB
    maxFiles: 5,
    colorize: false,
    format: combine(
        timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
        }),
        json(),
    ),
}

export const console = {  
    handleExceptions: true,
    json: false,
    colorize: true,
    format: combine(
        timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
        }),
        json(),
    ),
}