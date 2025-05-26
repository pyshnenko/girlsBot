import * as dotenv from 'dotenv';
dotenv.config();
const { Telegraf } = require('telegraf');
var jwt = require('jsonwebtoken');
import express, { Express, Request, Response } from "express";
const bot = new Telegraf(String(process.env.TGTOK));
import { Markup, session } from 'telegraf';
import sql from './mech/sql'
import { TGCheck, TGFrom } from './types/tgTypes';
import { CronJob } from 'cron';
import { getMonth } from './consts/tg';
import swaggerUi from "swagger-ui-express";

export const app: Express = express();

bot.use(session());

bot.telegram.setMyCommands([
    { command: '/start', description: 'Старт' },
])

bot.start(async (ctx: any) => {
    console.log('start')
    let checkUser: boolean | TGCheck = await sql.userCheck(ctx.from.id);
    console.log(checkUser);
    if (checkUser === false) {
        sql.userAdd(ctx.from.id, false, false, ctx.from);
        ctx.reply('Здравствуйте. Администратор в ближайшее время будет уведомлен о Вашем визите');
        let admins: {id: number}[] = await sql.askAllAdmin();
        let sendToAdmin: boolean = false;
    }
    else if (checkUser!==true){
        if (checkUser.is_admin) {  //(ctx.from.id===Number(process.env.ADMIN))||
            console.log('admin');
            const users: boolean | TGFrom[] = await sql.userSearch({});
            if (!users) ctx.reply('Не получил данные от сервера, попробуй снова');
            else {
                const sUsers: {id: number, name: string}[] | null = [];
                typeof(users)!=='boolean'?
                    users.forEach((item: TGFrom)=>{if (item.register) sUsers.push({name: `${item?.first_name||''} ${item?.last_name||''} ${item?.username||''}`, id: item.id})}) :
                    null;
                const tokenSU: string = jwt.sign({ data: sUsers }, 'someText');
                ctx.replyWithHTML('Держи клавиатурку', Markup.keyboard([
                    [
                        {text: 'Список пользователей', web_app: {url: `https://spamigor.ru/vika/users?id=${ctx.from.id}`}},
                        {text: 'Календарь', web_app: {url: `https://spamigor.ru/vika/events?id=${ctx.from.id}&admin=${true}`}},
                        {text: 'Создать событие'}
                    ],
                    [
                        {text: 'Добавить свободные даты в календарь'},
                        {text: 'Добавить занятые даты в календарь'}
                    ]
                ]))
            }
        } 
        else {
            ctx.replyWithHTML('Держи клавиатурку', Markup.keyboard([
                    [
                        {text: 'Календарь', web_app: {url: `https://spamigor.ru/vika/events?id=${ctx.from.id}&admin=${false}`}}
                    ],
                    [
                        {text: 'Добавить свободные даты в календарь'},
                        {text: 'Добавить занятые даты в календарь'}
                    ]
                ]))
        }
        ctx.reply(`Привет ${ctx.from.first_name||ctx.from.last_name||ctx.from.username||''}!\n${checkUser.register?'Ты в списках!':'Ожидай решение администратора'}`)          
    }
    else ctx.reply('Ты недостоин');
});

bot.on('callback_query', async (ctx: any) => {
    let session = {...ctx.session};
    ctx.deleteMessage();
    if (ctx.callbackQuery.data === 'YES') {
        if (session?.make === 'newEvent') {
            await sql.addEvent(ctx.from.id, session?.event?.name, session?.event?.date)
            ctx.reply('добавлено')
        }
        console.log(session.event?.date)
        session = {}
    } else if (ctx.callbackQuery.data === 'NO') {
        session = {}
    } else {
        const dataSplit: string[] = ctx.callbackQuery.data.split('_')
        const command = dataSplit[0];
        const commandIndex = Number(dataSplit[1]);
        console.log(commandIndex)
        if (command === 'setFreeDayMonth') {
            const month = ((new Date()).getMonth() + commandIndex + 1)
            session.make = 'freeDay';
            session.await = 'day'
            session.date = {year: month > 11 ? (new Date()).getFullYear() + 1 : (new Date()).getFullYear(), month: month%12, day: 0}
            ctx.reply('Введи даты через пробел или запятую. Например: 1, 2,3 4')
        }
        else if (command === 'setBusyDayMonth') {
            const month = ((new Date()).getMonth() + commandIndex + 1)
            session.make = 'busyDay';
            session.await = 'day'
            session.date = {year: month > 11 ? (new Date()).getFullYear() + 1 : (new Date()).getFullYear(), month: month%12, day: 0}
            ctx.reply('Введи даты через пробел или запятую. Например: 1, 2,3 4')
        }
        console.log(ctx.callbackQuery.data)
    }
    ctx.session = session
})

bot.on('message', async (ctx: {message: {text: string}, from: {id: number}, session: any, reply: (t: string)=>void, replyWithHTML: any}) => {
    let session = {...ctx.session};
    let checkUser: boolean | TGCheck = await sql.userCheck(ctx.from.id);
    switch (ctx.message.text) {
        case 'Создать событие': {
            if (typeof(checkUser)!=='boolean' && checkUser?.is_admin) {
                ctx.reply('Введи название события')
                session = {};
                session.make = 'newEvent';
                session.await = 'name';
            } else ctx.reply('обратись к администратору')
            break;
        }
        case 'Добавить свободные даты в календарь': {
            session = {};
            ctx.replyWithHTML('Выбери месяц',
                Markup.inlineKeyboard([
                    Markup.button.callback(getMonth((new Date()).getMonth()), 'setFreeDayMonth_0'),
                    Markup.button.callback(getMonth((new Date()).getMonth() + 1), 'setFreeDayMonth_1'),
                    Markup.button.callback(getMonth((new Date()).getMonth() + 2), 'setFreeDayMonth_2')
                ])
            )
            break;
        }
        case 'Добавить занятые даты в календарь': {
            session = {};
            ctx.replyWithHTML('Выбери месяц',
                Markup.inlineKeyboard([
                    Markup.button.callback(getMonth((new Date()).getMonth()), 'setBusyDayMonth_0'),
                    Markup.button.callback(getMonth((new Date()).getMonth() + 1), 'setBusyDayMonth_1'),
                    Markup.button.callback(getMonth((new Date()).getMonth() + 2), 'setBusyDayMonth_2')
                ])
            )
            break;
        }
        default: {
            if (ctx.session?.make === 'newEvent' && ctx.session?.await === 'date') {
                const dateText: string[] = ctx.message.text.replaceAll(' ', '').replaceAll(',', '.').split('.');
                session.event = {...session.event, date: `${dateText[2]}-${dateText[1]}-${dateText[0]}`}
                ctx.replyWithHTML(`Проверь:\n${ctx.session?.event?.name||''}\n${(new Date(dateText[2]+'-'+dateText[1]+'-'+dateText[0]).toLocaleDateString())}`,
                    Markup.inlineKeyboard([
                        Markup.button.callback('Да', 'YES'),
                        Markup.button.callback('Нет', 'NO')
                    ])
            )
            }
            else if (ctx.session?.make === 'newEvent' && ctx.session?.await === 'name') {
                session.await = 'date';
                session.event = {name: ctx.message.text, date: ''}
                ctx.reply(`Введи дату в формате DD.MM.YYYY (через точку). Например: ${(new Date().getDate())}.${(new Date().getMonth()+1)}.${(new Date()).getFullYear()}`)
            }
            else if ((ctx.session?.make === 'freeDay') || (ctx.session?.make === 'busyDay')) {
                const dayArray: string[] = ctx.message.text.replaceAll(' ', ',').split(',').filter((item: string)=>Number(item));
                let mess = '';
                console.log(session)
                dayArray.forEach((item: string) => {mess+=(new Date(`${session.date.year}-${session.date.month}-${item}`).toLocaleDateString())+'\n'})
                ctx.replyWithHTML(mess,
                    Markup.inlineKeyboard([
                        Markup.button.callback('Да', 'YES'),
                        Markup.button.callback('Нет', 'NO')
                    ])
                )
            }
        }
    }
    ctx.session = session;
})

bot.launch();

bot.catch((err: any)=>console.log('Что-то с ботом' + String(err)));

const options = {
  swaggerOptions: {
    url: 'https://spamigor.ru/demoFiles/girlsEvents/swagger.json',
    swaggerOptions: {
      validatorUrl : null
    }
  }
}

app.use('/girls/docs', swaggerUi.serve, swaggerUi.setup(null, options));

app.use(express.json());

app.get('/girls/api/events', async (req: Request, res: Response) => {
    const resp = await sql.getEvent();
    res.json(resp)
})

app.post("/girls/api/users", async (req: Request, res: Response) => {
    const userId: number = Number(req.headers.authorization?.slice(7) || 0)
    if (!userId) res.sendStatus(401)
    else {
        console.log(req.body.tgid)
        const sqlCheck: boolean|TGCheck = await sql.userCheck(userId);
        if (sqlCheck === false) res.sendStatus(401)
        else if (sqlCheck !== true && !sqlCheck.is_admin) res.sendStatus(403)
        else if (req.body?.tgid && (req.body?.is_admin || req.body.is_admin === false)) {
            const tgData: TGFrom = req.body;
            const admin: boolean = req.body?.is_admin;
            const id: number = req.body.tgid;
            const result = await sql.userAdd(id, admin, req.body?.register || false, tgData);
            res.json(result)
        }
        else res.sendStatus(418)
    }
})

app.get("/girls/api/users", async (req: Request, res: Response) => {
    const userId: number = Number(req.headers.authorization?.slice(7) || 0)
    if (!userId) res.sendStatus(401)
    else {
        const sqlCheck: boolean|TGCheck = await sql.userCheck(userId);
        if (sqlCheck === false) res.sendStatus(401)
        else if (sqlCheck !== true && !sqlCheck.is_admin) res.sendStatus(403)
        else {
            console.log(req.body)
            const result = await sql.userSearch({})
            res.json(result)
        }
    }
})

app.delete("/girls/api/users/:tgid", async (req: Request, res: Response) => {
    const userId: number = Number(req.headers.authorization?.slice(7) || 0)
    if (!userId) res.sendStatus(401)
    else {
        const sqlCheck: boolean|TGCheck = await sql.userCheck(userId);
        if (sqlCheck === false) res.sendStatus(401)
        else if (sqlCheck !== true && !sqlCheck.is_admin) res.sendStatus(403)
        else {
            console.log(req.body)
            const result = await sql.delUser(Number(req.params['tgid']))
            res.json(result)
        }
    }
})

app.put("/girls/api/users/:tgid", async (req: Request, res: Response) => {
    const userId: number = Number(req.headers.authorization?.slice(7) || 0)
    if (!userId) res.sendStatus(401)
    else {
        console.log(req.body)
        const sqlCheck: boolean|TGCheck = await sql.userCheck(userId);
        if (sqlCheck === false) res.sendStatus(401)
        else if (sqlCheck !== true && !sqlCheck.is_admin) res.sendStatus(403)
        else if (req.body?.tgid && (req.body?.is_admin || req.body.is_admin === false)) {
            const tgData: TGFrom = req.body;
            const admin: boolean = req.body?.is_admin;
            const id: number = req.body.tgid;
            const result = await sql.userAdd(id, admin, req.body?.register || false, tgData);
            res.json(result)
        }
        else res.sendStatus(418)
    }
})

app.get("/girls/api/sqlCheck", async (req: Request, res: Response) => {
    const userId: number = Number(req.headers.authorization?.slice(7) || 0)
    if (!userId) res.sendStatus(401)
    else {
        const sqlCheck: boolean|TGCheck = await sql.userCheck(userId);
        if (sqlCheck === false) res.sendStatus(401)
        else if (sqlCheck !== true && !sqlCheck.is_admin) res.sendStatus(403)
        else res.json(sqlCheck)
    }
})

app.listen(8900, ()=>{console.log('Hello on 8900')})