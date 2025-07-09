import 'module-alias/register';
import * as dotenv from 'dotenv';
dotenv.config();
import { Telegraf, session } from 'telegraf';
const bot = new Telegraf(String(process.env.TGTOK));
import start from '@/bot/start';
import {Context} from '@/types/bot';
import message from '@/bot/message';
import callback from '@/bot/callback';
import app from '@/api';
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
