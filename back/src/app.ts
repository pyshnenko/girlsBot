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
import axios from 'axios';
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

bot.on('photo', async (ctx)=>{
    console.log(ctx.message);
    /*const linc: string = (await axios.get(`https://api.telegram.org/bot${String(process.env.TGTOK)}/getFile?file_id=${ctx.message.photo[1].file_id}`)).data.result.file_path;
    bot.telegram.sendPhoto(209103348, `https://api.telegram.org/file/bot${String(process.env.TGTOK)}/${linc}`)*/
})

bot.on('callback_query', async (ctx: any) => {
    ctx.session = await callback(ctx as Context, (ctx as Context).session, bot);
})

bot.on('message', async (ctx: any) => {
    ctx.session = await message((ctx as Context), (ctx as Context).session, bot);
})

//bot.launch();

bot.catch((err: any)=>console.log('Что-то с ботом' + String(err)));

app.listen(8900, ()=>{console.log('Hello on 8900')})
