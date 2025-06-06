"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const { Telegraf } = require('telegraf');
var jwt = require('jsonwebtoken');
const bot = new Telegraf(String(process.env.TGTOK));
const telegraf_1 = require("telegraf");
const start_1 = __importDefault(require("./bot/start"));
const message_1 = __importDefault(require("./bot/message"));
const callback_1 = __importDefault(require("./bot/callback"));
const api_1 = __importDefault(require("./api"));
bot.use((0, telegraf_1.session)());
bot.telegram.setMyCommands([
    { command: '/start', description: 'Старт' },
]);
bot.start((ctx) => __awaiter(void 0, void 0, void 0, function* () {
    (0, start_1.default)(ctx);
}));
bot.on('callback_query', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    (0, callback_1.default)(ctx, ctx.session);
}));
bot.on('message', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.session = yield (0, message_1.default)(ctx);
}));
bot.launch();
bot.catch((err) => console.log('Что-то с ботом' + String(err)));
api_1.default.listen(8900, () => { console.log('Hello on 8900'); });
