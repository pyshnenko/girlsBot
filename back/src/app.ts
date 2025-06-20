import * as dotenv from 'dotenv';
dotenv.config();
import { Telegraf } from 'telegraf';
const bot = new Telegraf(String(process.env.TGTOK));
import { session } from 'telegraf';
import start from './bot/start';
import {Context} from './types/bot';
import message from './bot/message';
import callback from './bot/callback';
import app from './api';

bot.use(session());

bot.telegram.setMyCommands([
    { command: '/start', description: 'Начинаем начинать' },
    { command: '/support', description: 'Поддержка' },
    { command: '/tariff', description: 'Денюшки' },
    { command: '/info', description: 'Как пользоваться?' }
])

bot.start(async (ctx: any) => {
    ctx.session = await start(ctx as Context, (ctx as Context).session);
});

bot.on('callback_query', async (ctx: any) => {
    ctx.session = await callback(ctx as Context, (ctx as Context).session);
})

bot.on('message', async (ctx: any) => {
    ctx.session = await message((ctx as Context), (ctx as Context).session);
})

//bot.launch();

bot.catch((err: any)=>console.log('Что-то с ботом' + String(err)));

app.listen(8900, ()=>{console.log('Hello on 8900')})
