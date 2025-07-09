"use strict";
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
exports.default = message;
const telegraf_1 = require("telegraf");
const keyboard_1 = require("@/mech/keyboard");
const tg_1 = require("@/consts/tg");
const keyboard_2 = require("@/mech/keyboard");
const sql_1 = __importDefault(require("@/mech/sql"));
function message(ctx, session, bot) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
        //let session = {...ctx.session};
        let checkUser = yield sql_1.default.user.userCheck(ctx.from.id);
        console.log('start');
        console.log(checkUser);
        console.log(ctx.session);
        switch (ctx.message.text) {
            case '/info': {
                ctx.reply(Math.floor(Math.random() * 10) % 2 ? 'Там-сям, туда-сюда' : 'Сбожьей помощью');
                break;
            }
            case '/tariff': {
                ctx.reply('Наш единственный разработчик нуждается в поддержке');
                break;
            }
            case '/support': {
                ctx.reply(Math.floor(Math.random() * 10) % 2 ? '*нежно похлопываю вас по плечу*' : 'Мы верим в тебя!!!!');
                break;
            }
            case '➕Создать группу': {
                session = { make: "new group" };
                ctx.reply('Введи название группы');
                break;
            }
            case 'Выбрать другую группу': {
                sql_1.default.active.setActiveDate(ctx.from.id, 0);
                (0, keyboard_1.searchGroupKeyboard)(ctx, 'Давай выберем другую группу');
                break;
            }
            case '🔎Найти группу': {
                session = { make: "search group" };
                ctx.reply('Введи id группы (узнать его можно у создателя группы)');
                break;
            }
            case '🧾Выбрать группу из имеющихся у Вас': {
                session = {};
                const groups = yield sql_1.default.group.getGroup(ctx.from.id);
                if (!groups)
                    ctx.reply('что-то пошло не так. нажми /start');
                else {
                    ctx.replyWithHTML('Выбери группу', telegraf_1.Markup.inlineKeyboard(groups.map((item) => telegraf_1.Markup.button.callback(item.name, `setActiveGroup_${item.Id}`))));
                }
                break;
            }
            case '➕Создать событие': {
                if ((typeof (checkUser) !== 'boolean') || checkUser === true) {
                    ctx.reply('Введи название события');
                    //session = {activeGroup: session.activeGroup};
                    session.make = 'newEvent';
                    session.await = 'name';
                }
                else
                    ctx.reply('обратись к администратору');
                break;
            }
            case '🖌Добавить свободные даты в календарь': {
                //session = {activeGroup: session.activeGroup};
                ctx.replyWithHTML('Выбери месяц', telegraf_1.Markup.inlineKeyboard([
                    telegraf_1.Markup.button.callback((0, tg_1.getMonth)((new Date()).getMonth()), 'setFreeDayMonth_0'),
                    telegraf_1.Markup.button.callback((0, tg_1.getMonth)((new Date()).getMonth() + 1), 'setFreeDayMonth_1'),
                    telegraf_1.Markup.button.callback((0, tg_1.getMonth)((new Date()).getMonth() + 2), 'setFreeDayMonth_2')
                ]));
                break;
            }
            case '🖍Добавить занятые даты в календарь': {
                //session = {activeGroup: session.activeGroup};
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
                    (0, keyboard_2.YNKeyboard)(ctx, `Проверь:\n${((_d = (_c = ctx.session) === null || _c === void 0 ? void 0 : _c.event) === null || _d === void 0 ? void 0 : _d.name) || ''}\n${((_f = (_e = ctx.session) === null || _e === void 0 ? void 0 : _e.event) === null || _f === void 0 ? void 0 : _f.location) || ''}\n${((_h = (_g = ctx.session) === null || _g === void 0 ? void 0 : _g.event) === null || _h === void 0 ? void 0 : _h.linc) || ''}\n${(new Date(dateText[2] + '-' + dateText[1] + '-' + dateText[0]).toLocaleDateString())}`);
                }
                else if (((_j = ctx.session) === null || _j === void 0 ? void 0 : _j.make) === 'newEvent' && ((_k = ctx.session) === null || _k === void 0 ? void 0 : _k.await) === 'location') {
                    session.await = 'date';
                    session.event = { name: (_l = session.event) === null || _l === void 0 ? void 0 : _l.name, location: ctx.message.text, date: '', linc: (_m = session.event) === null || _m === void 0 ? void 0 : _m.linc };
                    ctx.reply(`Введи дату в формате DD.MM.YYYY (через точку). Например: ${(new Date().getDate())}.${(new Date().getMonth() + 1)}.${(new Date()).getFullYear()}`);
                }
                else if (((_o = ctx.session) === null || _o === void 0 ? void 0 : _o.make) === 'newEvent' && ((_p = ctx.session) === null || _p === void 0 ? void 0 : _p.await) === 'linc') {
                    session.await = 'location';
                    session.event = { name: (_q = session.event) === null || _q === void 0 ? void 0 : _q.name, location: '', date: '', linc: ctx.message.text };
                    ctx.reply(`напиши место проведения события`);
                }
                else if (((_r = ctx.session) === null || _r === void 0 ? void 0 : _r.make) === 'newEvent' && ((_s = ctx.session) === null || _s === void 0 ? void 0 : _s.await) === 'name') {
                    session.await = 'linc';
                    session.event = { name: ctx.message.text, location: '', date: '', linc: '' };
                    ctx.reply(`укажи коментарий или ссылку на событие`);
                }
                else if ((((_t = ctx.session) === null || _t === void 0 ? void 0 : _t.make) === 'freeDay') || (((_u = ctx.session) === null || _u === void 0 ? void 0 : _u.make) === 'busyDay')) {
                    const dayArray = ctx.message.text.replaceAll(' ', ',').split(',').filter((item) => Number(item));
                    let mess = '';
                    console.log(session);
                    session.result = dayArray;
                    dayArray.forEach((item) => { var _a, _b; mess += (new Date(`${(_a = session === null || session === void 0 ? void 0 : session.date) === null || _a === void 0 ? void 0 : _a.year}-${(_b = session === null || session === void 0 ? void 0 : session.date) === null || _b === void 0 ? void 0 : _b.month}-${item}`).toLocaleDateString()) + '\n'; });
                    (0, keyboard_2.YNKeyboard)(ctx, mess);
                }
                else if (((_v = ctx.session) === null || _v === void 0 ? void 0 : _v.make) === 'search group') {
                    const result = yield sql_1.default.group.searchGroup(Number(ctx.message.text), ctx.from.id);
                    console.log(result);
                    if (result) {
                        const searchMe = result.filter((item) => item.tgId === ctx.from.id);
                        if (searchMe.length && searchMe[0].register) {
                            delete (session.make);
                            (0, keyboard_1.GroupKeyboard)(ctx, 'Группа выбрана', searchMe[0].Id, searchMe[0].admin ? true : false);
                        }
                        else if (searchMe.length && !searchMe[0].register) {
                            delete (session.make);
                            ctx.reply('Администратор еще не принял решение');
                        }
                        else {
                            session.result = { id: Number(ctx.message.text), name: result[0].name };
                            (0, keyboard_2.YNKeyboard)(ctx, `Подать запрос на вступление в группу "${result[0].name}"?`);
                        }
                    }
                    else
                        ctx.reply('не найдено');
                }
                else if (((_w = ctx.session) === null || _w === void 0 ? void 0 : _w.make) === 'new group') {
                    session.result = ctx.message.text;
                    (0, keyboard_2.YNKeyboard)(ctx, `Группа будет называться:\n${ctx.message.text}`);
                }
                else if (ctx.message.text.includes('All') && ctx.from.id === Number(process.env.ADMIN)) {
                    const userList = yield sql_1.default.user.userSearch({}, 0);
                    userList.map((item) => bot.telegram.sendMessage(item.id, ctx.message.text.slice(5)));
                    console.log(userList);
                }
            }
        }
        return session;
    });
}
