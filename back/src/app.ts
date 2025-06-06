import * as dotenv from 'dotenv';
dotenv.config();
const { Telegraf } = require('telegraf');
var jwt = require('jsonwebtoken');
const bot = new Telegraf(String(process.env.TGTOK));
import { session } from 'telegraf';
import start from './bot/start';
import {Context} from './types/bot';
import message from './bot/message';
import callback from './bot/callback';
import app from './api';

bot.use(session());

bot.telegram.setMyCommands([
    { command: '/start', description: 'Старт' },
])

bot.start(async (ctx: Context) => {
    ctx.session = await start(ctx, ctx.session);
});

bot.on('callback_query', async (ctx: Context) => {
    ctx.session = await callback(ctx, ctx.session);
})

bot.on('message', async (ctx: any) => {
    ctx.session = await message(ctx, ctx.session);
})

bot.launch();

bot.catch((err: any)=>console.log('Что-то с ботом' + String(err)));

app.listen(8900, ()=>{console.log('Hello on 8900')})
