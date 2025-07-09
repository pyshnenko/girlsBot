"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
var appRoot = require('app-root-path');
const winston_1 = __importDefault(require("winston"));
const config_1 = __importDefault(require("@/winston/config"));
exports.logger = new winston_1.default.Logger({
    transports: [
        new winston_1.default.transports.File(config_1.default.file),
        new winston_1.default.transports.Console(config_1.default.console)
    ],
    exitOnError: false
});
