import * as dotenv from 'dotenv';
dotenv.config();
const { Telegraf } = require('telegraf');
var jwt = require('jsonwebtoken');
import express, { Express, Request, Response } from "express";
const bot = new Telegraf(String(process.env.TGTOK));
import { Markup, session } from 'telegraf';
import sql from './mech/sql'
import { TGCheck, TGFrom } from './types/tgTypes';
import { groupSearchResult } from './types/sql';
import { CronJob } from 'cron';
import { getMonth } from './consts/tg';
import swaggerUi from "swagger-ui-express";
import { checkAuth } from './mech/funcs';
import { register } from 'module';
import { GroupKeyboard, YNKeyboard } from './mech/keyboard';

export const app: Express = express();

bot.use(session());

bot.telegram.setMyCommands([
    { command: '/start', description: 'Старт' },
])

bot.start(async (ctx: any) => {
    console.log('start')
    ctx.session = {};
    let checkUser: boolean | TGCheck = await sql.userCheck(ctx.from.id);
    if (checkUser === false) {
        sql.userAdd(ctx.from.id, false, false, ctx.from);
    }
    ctx.replyWithHTML('Добро пожаловать в согласовальню!', 
        Markup.keyboard([
            [
                {text: 'Выбрать группу из имеющихся у Вас'}
            ],
            [
                {text: 'Создать группу'},
                {text: 'Найти группу'}
            ]
        ])
    )
});

bot.on('callback_query', async (ctx: any) => {
    let session = {...ctx.session};
    ctx.deleteMessage();
    if (ctx.callbackQuery.data === 'YES') {
        if (session?.make === 'newEvent') {
            await sql.addEvent(ctx.from.id, session?.event?.name, new Date(session?.event?.date), '', '')
            ctx.reply('добавлено')
        }
        else if ((session?.make === 'freeDay') || (session?.make === 'busyDay')) {
            let days: number[] = []
            console.log('add days')
            if (Array.isArray(session?.result)) {
                console.log(session)
                days = session.result.map((item: string)=>Number(new Date(`${session.date.year}-${session.date.month}-${item}`)))
                console.log(days)
                console.log(await sql.setCalendar(days, ctx.from.id, session.make === 'freeDay'?1:session?.make === 'busyDay'?2:null))
                ctx.reply('Выполнено')
            }
            else ctx.reply('что-то пошло не так')
        }
        else if (session?.make === 'new group') {
            await sql.setGroup(ctx.from.id, session.result||'none', true, true);
            ctx.reply('Создано')
        }
        else if (session?.make === 'search group') {
            await sql.setGroup(ctx.from.id, session.result.name, false, false, session.result.id);
            ctx.reply('Создано')
        }
        console.log(session.event?.date)
        session = {activeGroup: session.activeGroup}
    } else if (ctx.callbackQuery.data === 'NO') {
        session = {activeGroup: session.activeGroup}
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
        else if (command === 'setActiveGroup') {
            session={activeGroup:commandIndex};
            GroupKeyboard(ctx, 'Группа задана')
        }
        console.log(ctx.callbackQuery.data)
    }
    ctx.session = session
})

bot.on('message', async (ctx: {message: {text: string}, from: {id: number}, session: any, reply: (t: string)=>void, replyWithHTML: any}) => {
    let session = {...ctx.session};
    let checkUser: boolean | TGCheck = await sql.userCheck(ctx.from.id);
    switch (ctx.message.text) {
        case 'Создать группу': {
            session = {};
            session.make = "new group"
            ctx.reply('Введи название группы');
            break;
        }
        case 'Найти группу': {
            session = {};
            session.make = "search group"
            ctx.reply('Введи id группы (узнать его можно у создателя группы)');
            break;
        }
        case 'Выбрать группу из имеющихся у Вас': {
            session = {};
            const groups = await sql.getGroup(ctx.from.id)
            if (!groups) ctx.reply('что-то пошло не так. нажми /start')
            else {
                ctx.replyWithHTML('Выбери группу',
                    Markup.inlineKeyboard(groups.map((item: groupSearchResult)=>
                        Markup.button.callback(item.name, `setActiveGroup_${item.Id}`)))
                )
            }
            break;
        }
        case 'Создать событие': {
            if (typeof(checkUser)!=='boolean') {
                ctx.reply('Введи название события')
                session = {activeGroup: session.activeGroup};
                session.make = 'newEvent';
                session.await = 'name';
            } else ctx.reply('обратись к администратору')
            break;
        }
        case 'Добавить свободные даты в календарь': {
            session = {activeGroup: session.activeGroup};
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
            session = {activeGroup: session.activeGroup};
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
                YNKeyboard(ctx, `Проверь:\n${ctx.session?.event?.name||''}\n${(new Date(dateText[2]+'-'+dateText[1]+'-'+dateText[0]).toLocaleDateString())}`)
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
                session.result = dayArray;
                dayArray.forEach((item: string) => {mess+=(new Date(`${session.date.year}-${session.date.month}-${item}`).toLocaleDateString())+'\n'})
                YNKeyboard(ctx, mess)
            }
            else if (ctx.session?.make==='search group') {
                const result = await sql.searchGroup(Number(ctx.message.text), ctx.from.id)
                if (result && result.register) GroupKeyboard(ctx, 'Группа выбрана')
                else if (result && !result.register) {
                    session.result={id: Number(ctx.message.text), name: result.name};
                    YNKeyboard(ctx, `Подать запрос на вступление в группу "${result.name}"?`)
                }
                else ctx.reply('не найдено')
            }
            else if (ctx.session?.make === 'new group'){
                session.result = ctx.message.text;                
                YNKeyboard(ctx, `Группа будет называться:\n${ctx.message.text}`)
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
    const code = await checkAuth(req.headers.authorization || '');
    if (code.code === 200) {
        const from: Date = new Date(Number(req.query?.from));
        const to: Date = new Date(Number(req.query?.to));
        if (from.toJSON()&&to.toJSON()) {
            const resp = await sql.getEvent(from, to);
            console.log(resp)
            res.json(resp)
        }
        else if (from.toJSON()) {
            const resp = await sql.getEvent(from);
            console.log('fff')
            console.log(resp)
            res.status(200).json(resp)
        }
        else res.sendStatus(418)
    }
    else res.sendStatus(code.code)
})

app.post('/girls/api/events', async (req: Request, res: Response) => {
    const code = await checkAuth(req.headers.authorization || '', true);
    if (code.code === 200) {
        if (code.id && req.body?.name && req.body?.date && req.body.place && req.body.link) {
            const resp = await sql.addEvent(code.id, req.body.name, new Date(req.body.date), req.body.place, req.body.link);
            res.json(resp)
        }
        else res.sendStatus(418);
    }
    else res.sendStatus(code.code)
})

app.put('/girls/api/events/:id', async (req: Request, res: Response) => {
    const code = await checkAuth(req.headers.authorization || '', true);
    if (code.code === 200) {
        if (Number(req.params['id']) && req.body?.name && req.body?.date && req.body.place && req.body.link) {
            await sql.updEvent(Number(req.params['id']), req.body.name, new Date(req.body.date), req.body.place, req.body.link)
            res.json(true)
        }
        else res.sendStatus(418);
    }
    else res.sendStatus(code.code)
})

app.put('/girls/api/eventsYN/:id', async (req: Request, res: Response) => {
    const code = await checkAuth(req.headers.authorization || '');
    if (code.code === 200) {
        if (req.query.req && Number(req.params['id'])) {
            await sql.YNEvent(Number(req.params['id']), req.query?.req === 'true' ? 1 : req.query.req === 'false' ? 2 : null, code.id||0)
            res.json(true)
        }
        else res.sendStatus(418);
    }
    else res.sendStatus(code.code)
})

app.delete('/girls/api/events/:id', async (req: Request, res: Response) => {
    const code = await checkAuth(req.headers.authorization || '', true);
    if (code.code === 200) {
        await sql.delEvent(Number(req.params['id']))
        res.json(true)
    }
    else res.sendStatus(code.code)
})

app.get("/girls/api/calendar", async (req: Request, res: Response) => {
    const code = await checkAuth(req.headers.authorization || '');
    if (code.code === 200) {
        const from: Date = new Date(Number(req.query.from))
        const to: Date = new Date(Number(req.query.to))
        if (from.toJSON() && to.toJSON())
            res.json({
                calendar: await sql.getCalendar(from, to),
                users: await sql.userSearch({}),
                events: await sql.getEvent(from, to)
            })
        else res.sendStatus(418)
    }
    else res.sendStatus(code.code)
})

app.post("/girls/api/calendar", async (req: Request, res: Response) => {
    const code = await checkAuth(req.headers.authorization || '');
    if (code.code === 200) {
        if (Array.isArray(req.body.freeDays) && Array.isArray(req.body.busyDays)){
            console.log(req.body.freeDays)
            await sql.setCalendar(req.body.freeDays, code.id||0, 1)
            await sql.setCalendar(req.body.busyDays, code.id||0, 2)
            res.json(true)
        }
        else res.sendStatus(418)
    }
    else res.sendStatus(code.code)
})

app.post("/girls/api/users", async (req: Request, res: Response) => {
    const code = await checkAuth(req.headers.authorization || '', true);
    if (code.code === 200) {
        if (req.body?.tgid && (req.body?.is_admin || req.body.is_admin === false)) {
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
    const code = await checkAuth(req.headers.authorization || '');
    if (code.code === 200) {
        const result = await sql.userSearch({})
        res.json(result)
    }
    else res.sendStatus(code.code)
})

app.delete("/girls/api/users/:tgid", async (req: Request, res: Response) => {
    const code = await checkAuth(req.headers.authorization || '', true);
    if (code.code === 200) {
        const result = await sql.delUser(Number(req.params['tgid']))
        res.json(result)
    }
})

app.put("/girls/api/users/:tgid", async (req: Request, res: Response) => {
    const code = await checkAuth(req.headers.authorization || '', true);
    if (code.code === 200) {
        console.log(req.body)
        if (req.body?.tgid && (req.body?.is_admin || req.body.is_admin === false || req.body.is_admin === 0)) {
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

app.get("/girls/api/startCheck", (req: Request, res: Response) => {res.sendStatus(200)})

app.listen(8900, ()=>{console.log('Hello on 8900')})
