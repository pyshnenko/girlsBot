import {file, console} from '@/winston/baseConfig';
var appRoot = require('app-root-path');

export default function ConfigCreator(mode: 'api'|'bot') {
    return {
        fileInfo: {
            ...file,
            filename: `${appRoot}/logs/${mode}/app.log`
        },
        fileDebug: {
            ...file,
            level: 'debug',
            filename: `${appRoot}/logs/${mode}/app.log`
        },
        fileWarning: {
            ...file,
            level: 'warn',
            filename: `${appRoot}/logs/${mode}/app.log`
        },
        errfile: {
            ...file,
            level: 'error',
            filename: `${appRoot}/logs/${mode}/appErr.log`
        },
        consoleInfo: {  
            ...console
        },
        consoleDebug: {  
            ...console,
            level: 'debug'
        },
    }
}