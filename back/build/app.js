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
exports.app = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const { Telegraf } = require('telegraf');
var jwt = require('jsonwebtoken');
const express_1 = __importDefault(require("express"));
const bot = new Telegraf(String(process.env.TGTOK));
const telegraf_1 = require("telegraf");
const sql_1 = __importDefault(require("./mech/sql"));
const tg_1 = require("./consts/tg");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const funcs_1 = require("./mech/funcs");
exports.app = (0, express_1.default)();
bot.use((0, telegraf_1.session)());
bot.telegram.setMyCommands([
    { command: '/start', description: 'Старт' },
]);
bot.start((ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('start');
    let checkUser = yield sql_1.default.userCheck(ctx.from.id);
    console.log(checkUser);
    if (checkUser === false) {
        sql_1.default.userAdd(ctx.from.id, false, false, ctx.from);
        ctx.reply('Здравствуйте. Администратор в ближайшее время будет уведомлен о Вашем визите');
        let admins = yield sql_1.default.askAllAdmin();
        let sendToAdmin = false;
    }
    else if (checkUser !== true) {
        if (checkUser.is_admin) { //(ctx.from.id===Number(process.env.ADMIN))||
            console.log('admin');
            const users = yield sql_1.default.userSearch({});
            if (!users)
                ctx.reply('Не получил данные от сервера, попробуй снова');
            else {
                const sUsers = [];
                typeof (users) !== 'boolean' ?
                    users.forEach((item) => { if (item.register)
                        sUsers.push({ name: `${(item === null || item === void 0 ? void 0 : item.first_name) || ''} ${(item === null || item === void 0 ? void 0 : item.last_name) || ''} ${(item === null || item === void 0 ? void 0 : item.username) || ''}`, id: item.id }); }) :
                    null;
                const tokenSU = jwt.sign({ data: sUsers }, 'someText');
                ctx.replyWithHTML('Держи клавиатурку', telegraf_1.Markup.keyboard([
                    [
                        { text: 'Список пользователей', web_app: { url: `https://spamigor.ru/vika/users?id=${ctx.from.id}` } },
                        { text: 'Календарь', web_app: { url: `https://spamigor.ru/vika/events?id=${ctx.from.id}&admin=${true}` } },
                        { text: 'Создать событие' }
                    ],
                    [
                        { text: 'Добавить свободные даты в календарь' },
                        { text: 'Добавить занятые даты в календарь' }
                    ]
                ]));
            }
        }
        else {
            ctx.replyWithHTML('Держи клавиатурку', telegraf_1.Markup.keyboard([
                [
                    { text: 'Календарь', web_app: { url: `https://spamigor.ru/vika/events?id=${ctx.from.id}&admin=${false}` } }
                ],
                [
                    { text: 'Добавить свободные даты в календарь' },
                    { text: 'Добавить занятые даты в календарь' }
                ]
            ]));
        }
        ctx.reply(`Привет ${ctx.from.first_name || ctx.from.last_name || ctx.from.username || ''}!\n${checkUser.register ? 'Ты в списках!' : 'Ожидай решение администратора'}`);
    }
    else
        ctx.reply('Ты недостоин');
}));
bot.on('callback_query', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    let session = Object.assign({}, ctx.session);
    ctx.deleteMessage();
    if (ctx.callbackQuery.data === 'YES') {
        if ((session === null || session === void 0 ? void 0 : session.make) === 'newEvent') {
            yield sql_1.default.addEvent(ctx.from.id, (_a = session === null || session === void 0 ? void 0 : session.event) === null || _a === void 0 ? void 0 : _a.name, new Date((_b = session === null || session === void 0 ? void 0 : session.event) === null || _b === void 0 ? void 0 : _b.date), '', '');
            ctx.reply('добавлено');
        }
        else if (((session === null || session === void 0 ? void 0 : session.make) === 'freeDay') || ((session === null || session === void 0 ? void 0 : session.make) === 'busyDay')) {
            let days = [];
            if (Array.isArray(session === null || session === void 0 ? void 0 : session.result)) {
                days = session.result.map((item) => Number(new Date(`${session.date.year}-${session.date.month}-${item}T03:00:01.003Z`)));
                yield sql_1.default.setCalendar(days, ctx.from.id, session.make === 'freeDay' ? 1 : (session === null || session === void 0 ? void 0 : session.make) === 'busyDay' ? 2 : null);
                ctx.reply('Выполнено');
            }
            else
                ctx.reply('что-то пошло не так');
        }
        console.log((_c = session.event) === null || _c === void 0 ? void 0 : _c.date);
        session = {};
    }
    else if (ctx.callbackQuery.data === 'NO') {
        session = {};
    }
    else {
        const dataSplit = ctx.callbackQuery.data.split('_');
        const command = dataSplit[0];
        const commandIndex = Number(dataSplit[1]);
        console.log(commandIndex);
        if (command === 'setFreeDayMonth') {
            const month = ((new Date()).getMonth() + commandIndex + 1);
            session.make = 'freeDay';
            session.await = 'day';
            session.date = { year: month > 11 ? (new Date()).getFullYear() + 1 : (new Date()).getFullYear(), month: month % 12, day: 0 };
            ctx.reply('Введи даты через пробел или запятую. Например: 1, 2,3 4');
        }
        else if (command === 'setBusyDayMonth') {
            const month = ((new Date()).getMonth() + commandIndex + 1);
            session.make = 'busyDay';
            session.await = 'day';
            session.date = { year: month > 11 ? (new Date()).getFullYear() + 1 : (new Date()).getFullYear(), month: month % 12, day: 0 };
            ctx.reply('Введи даты через пробел или запятую. Например: 1, 2,3 4');
        }
        console.log(ctx.callbackQuery.data);
    }
    ctx.session = session;
}));
bot.on('message', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    let session = Object.assign({}, ctx.session);
    let checkUser = yield sql_1.default.userCheck(ctx.from.id);
    switch (ctx.message.text) {
        case 'Создать событие': {
            if (typeof (checkUser) !== 'boolean' && (checkUser === null || checkUser === void 0 ? void 0 : checkUser.is_admin)) {
                ctx.reply('Введи название события');
                session = {};
                session.make = 'newEvent';
                session.await = 'name';
            }
            else
                ctx.reply('обратись к администратору');
            break;
        }
        case 'Добавить свободные даты в календарь': {
            session = {};
            ctx.replyWithHTML('Выбери месяц', telegraf_1.Markup.inlineKeyboard([
                telegraf_1.Markup.button.callback((0, tg_1.getMonth)((new Date()).getMonth()), 'setFreeDayMonth_0'),
                telegraf_1.Markup.button.callback((0, tg_1.getMonth)((new Date()).getMonth() + 1), 'setFreeDayMonth_1'),
                telegraf_1.Markup.button.callback((0, tg_1.getMonth)((new Date()).getMonth() + 2), 'setFreeDayMonth_2')
            ]));
            break;
        }
        case 'Добавить занятые даты в календарь': {
            session = {};
            ctx.replyWithHTML('Выбери месяц', telegraf_1.Markup.inlineKeyboard([
                telegraf_1.Markup.button.callback((0, tg_1.getMonth)((new Date()).getMonth()), 'setBusyDayMonth_0'),
                telegraf_1.Markup.button.callback((0, tg_1.getMonth)((new Date()).getMonth() + 1), 'setBusyDayMonth_1'),
                telegraf_1.Markup.button.callback((0, tg_1.getMonth)((new Date()).getMonth() + 2), 'setBusyDayMonth_2')
            ]));
            break;
        }
        default: {
            if (((_a = ctx.session) === null || _a === void 0 ? void 0 : _a.make) === 'newEvent' && ((_b = ctx.session) === null || _b === void 0 ? void 0 : _b.await) === 'date') {
                const dateText = ctx.message.text.replaceAll(' ', '').replaceAll(',', '.').split('.');
                session.event = Object.assign(Object.assign({}, session.event), { date: `${dateText[2]}-${dateText[1]}-${dateText[0]}` });
                ctx.replyWithHTML(`Проверь:\n${((_d = (_c = ctx.session) === null || _c === void 0 ? void 0 : _c.event) === null || _d === void 0 ? void 0 : _d.name) || ''}\n${(new Date(dateText[2] + '-' + dateText[1] + '-' + dateText[0]).toLocaleDateString())}`, telegraf_1.Markup.inlineKeyboard([
                    telegraf_1.Markup.button.callback('Да', 'YES'),
                    telegraf_1.Markup.button.callback('Нет', 'NO')
                ]));
            }
            else if (((_e = ctx.session) === null || _e === void 0 ? void 0 : _e.make) === 'newEvent' && ((_f = ctx.session) === null || _f === void 0 ? void 0 : _f.await) === 'name') {
                session.await = 'date';
                session.event = { name: ctx.message.text, date: '' };
                ctx.reply(`Введи дату в формате DD.MM.YYYY (через точку). Например: ${(new Date().getDate())}.${(new Date().getMonth() + 1)}.${(new Date()).getFullYear()}`);
            }
            else if ((((_g = ctx.session) === null || _g === void 0 ? void 0 : _g.make) === 'freeDay') || (((_h = ctx.session) === null || _h === void 0 ? void 0 : _h.make) === 'busyDay')) {
                const dayArray = ctx.message.text.replaceAll(' ', ',').split(',').filter((item) => Number(item));
                let mess = '';
                console.log(session);
                session.result = dayArray;
                dayArray.forEach((item) => { mess += (new Date(`${session.date.year}-${session.date.month}-${item}`).toLocaleDateString()) + '\n'; });
                ctx.replyWithHTML(mess, telegraf_1.Markup.inlineKeyboard([
                    telegraf_1.Markup.button.callback('Да', 'YES'),
                    telegraf_1.Markup.button.callback('Нет', 'NO')
                ]));
            }
        }
    }
    ctx.session = session;
}));
bot.launch();
bot.catch((err) => console.log('Что-то с ботом' + String(err)));
const options = {
    swaggerOptions: {
        url: 'https://spamigor.ru/demoFiles/girlsEvents/swagger.json',
        swaggerOptions: {
            validatorUrl: null
        }
    }
};
exports.app.use('/girls/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(null, options));
exports.app.use(express_1.default.json());
exports.app.get('/girls/api/events', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const code = yield (0, funcs_1.checkAuth)(req.headers.authorization || '');
    if (code.code === 200) {
        const from = new Date(Number((_a = req.query) === null || _a === void 0 ? void 0 : _a.from));
        const to = new Date(Number((_b = req.query) === null || _b === void 0 ? void 0 : _b.to));
        if (from.toJSON() && to.toJSON()) {
            const resp = yield sql_1.default.getEvent(from, to);
            console.log(resp);
            res.json(resp);
        }
        else if (from.toJSON()) {
            const resp = yield sql_1.default.getEvent(from);
            console.log('fff');
            console.log(resp);
            res.status(200).json(resp);
        }
        else
            res.sendStatus(418);
    }
    else
        res.sendStatus(code.code);
}));
exports.app.post('/girls/api/events', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const code = yield (0, funcs_1.checkAuth)(req.headers.authorization || '', true);
    if (code.code === 200) {
        if (code.id && ((_a = req.body) === null || _a === void 0 ? void 0 : _a.name) && ((_b = req.body) === null || _b === void 0 ? void 0 : _b.date) && req.body.place && req.body.link) {
            const resp = yield sql_1.default.addEvent(code.id, req.body.name, new Date(req.body.date), req.body.place, req.body.link);
            res.json(resp);
        }
        else
            res.sendStatus(418);
    }
    else
        res.sendStatus(code.code);
}));
exports.app.put('/girls/api/events/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const code = yield (0, funcs_1.checkAuth)(req.headers.authorization || '', true);
    if (code.code === 200) {
        if (Number(req.params['id']) && ((_a = req.body) === null || _a === void 0 ? void 0 : _a.name) && ((_b = req.body) === null || _b === void 0 ? void 0 : _b.date) && req.body.place && req.body.link) {
            yield sql_1.default.updEvent(Number(req.params['id']), req.body.name, new Date(req.body.date), req.body.place, req.body.link);
            res.json(true);
        }
        else
            res.sendStatus(418);
    }
    else
        res.sendStatus(code.code);
}));
exports.app.put('/girls/api/eventsYN/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const code = yield (0, funcs_1.checkAuth)(req.headers.authorization || '');
    if (code.code === 200) {
        if (req.query.req && Number(req.params['id'])) {
            yield sql_1.default.YNEvent(Number(req.params['id']), ((_a = req.query) === null || _a === void 0 ? void 0 : _a.req) === 'true' ? 1 : req.query.req === 'false' ? 2 : null, code.id || 0);
            res.json(true);
        }
        else
            res.sendStatus(418);
    }
    else
        res.sendStatus(code.code);
}));
exports.app.delete('/girls/api/events/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const code = yield (0, funcs_1.checkAuth)(req.headers.authorization || '', true);
    if (code.code === 200) {
        yield sql_1.default.delEvent(Number(req.params['id']));
        res.json(true);
    }
    else
        res.sendStatus(code.code);
}));
exports.app.get("/girls/api/calendar", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const code = yield (0, funcs_1.checkAuth)(req.headers.authorization || '', true);
    if (code.code === 200) {
        const from = new Date(Number(req.query.from));
        const to = new Date(Number(req.query.to));
        if (from.toJSON() && to.toJSON())
            res.json({
                calendar: yield sql_1.default.getCalendar(from, to),
                users: yield sql_1.default.userSearch({})
            });
        else
            res.sendStatus(418);
    }
    else
        res.sendStatus(code.code);
}));
exports.app.post("/girls/api/calendar", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const code = yield (0, funcs_1.checkAuth)(req.headers.authorization || '', true);
    if (code.code === 200) {
        if (Array.isArray(req.body.freeDays) && Array.isArray(req.body.busyDays)) {
            console.log(req.body.freeDays);
            yield sql_1.default.setCalendar(req.body.freeDays, code.id || 0, 1);
            yield sql_1.default.setCalendar(req.body.busyDays, code.id || 0, 2);
            res.json(true);
        }
        else
            res.sendStatus(418);
    }
    else
        res.sendStatus(code.code);
}));
exports.app.post("/girls/api/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const code = yield (0, funcs_1.checkAuth)(req.headers.authorization || '', true);
    if (code.code === 200) {
        if (((_a = req.body) === null || _a === void 0 ? void 0 : _a.tgid) && (((_b = req.body) === null || _b === void 0 ? void 0 : _b.is_admin) || req.body.is_admin === false)) {
            const tgData = req.body;
            const admin = (_c = req.body) === null || _c === void 0 ? void 0 : _c.is_admin;
            const id = req.body.tgid;
            const result = yield sql_1.default.userAdd(id, admin, ((_d = req.body) === null || _d === void 0 ? void 0 : _d.register) || false, tgData);
            res.json(result);
        }
        else
            res.sendStatus(418);
    }
}));
exports.app.get("/girls/api/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const code = yield (0, funcs_1.checkAuth)(req.headers.authorization || '');
    if (code.code === 200) {
        const result = yield sql_1.default.userSearch({});
        res.json(result);
    }
    else
        res.sendStatus(code.code);
}));
exports.app.delete("/girls/api/users/:tgid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const code = yield (0, funcs_1.checkAuth)(req.headers.authorization || '', true);
    if (code.code === 200) {
        const result = yield sql_1.default.delUser(Number(req.params['tgid']));
        res.json(result);
    }
}));
exports.app.put("/girls/api/users/:tgid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    const code = yield (0, funcs_1.checkAuth)(req.headers.authorization || '', true);
    if (code.code === 200) {
        if (((_a = req.body) === null || _a === void 0 ? void 0 : _a.tgid) && (((_b = req.body) === null || _b === void 0 ? void 0 : _b.is_admin) || req.body.is_admin === false)) {
            if (((_c = req.body) === null || _c === void 0 ? void 0 : _c.tgid) && (((_d = req.body) === null || _d === void 0 ? void 0 : _d.is_admin) || req.body.is_admin === false)) {
                const tgData = req.body;
                const admin = (_e = req.body) === null || _e === void 0 ? void 0 : _e.is_admin;
                const id = req.body.tgid;
                const result = yield sql_1.default.userAdd(id, admin, ((_f = req.body) === null || _f === void 0 ? void 0 : _f.register) || false, tgData);
                res.json(result);
            }
            else
                res.sendStatus(418);
        }
        else
            res.sendStatus(418);
    }
}));
exports.app.get("/girls/api/sqlCheck", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = Number(((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.slice(7)) || 0);
    if (!userId)
        res.sendStatus(401);
    else {
        const sqlCheck = yield sql_1.default.userCheck(userId);
        if (sqlCheck === false)
            res.sendStatus(401);
        else if (sqlCheck !== true && !sqlCheck.is_admin)
            res.sendStatus(403);
        else
            res.json(sqlCheck);
    }
}));
exports.app.get("/girls/api/startCheck", (req, res) => { res.sendStatus(200); });
exports.app.listen(8900, () => { console.log('Hello on 8900'); });
