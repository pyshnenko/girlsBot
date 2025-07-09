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
exports.default = callback;
const keyboard_1 = require("@/mech/keyboard");
const sql_1 = __importDefault(require("@/mech/sql"));
const telegraf_1 = require("telegraf");
function callback(ctx, session, bot) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g;
        //let session = {...ctx.session};
        ctx.deleteMessage();
        if (ctx.callbackQuery.data === 'YES') {
            const group = yield sql_1.default.active.getActiveDate(ctx.from.id);
            if ((session === null || session === void 0 ? void 0 : session.make) === 'newEvent') {
                if (group) {
                    const eventID = (yield sql_1.default.event.addEvent(ctx.from.id, ((_a = session === null || session === void 0 ? void 0 : session.event) === null || _a === void 0 ? void 0 : _a.name) || '', new Date(((_b = session === null || session === void 0 ? void 0 : session.event) === null || _b === void 0 ? void 0 : _b.date) || 0), ((_c = session === null || session === void 0 ? void 0 : session.event) === null || _c === void 0 ? void 0 : _c.location) || '', ((_d = session === null || session === void 0 ? void 0 : session.event) === null || _d === void 0 ? void 0 : _d.linc) || '', group)) || 0;
                    const users = yield sql_1.default.user.userSearch({}, group);
                    yield ctx.reply('добавлено');
                    users.map((item) => __awaiter(this, void 0, void 0, function* () {
                        var _a, _b, _c, _d;
                        return yield bot.telegram.sendMessage(item.id, `Тебя приглашают\n${(new Date(((_a = session === null || session === void 0 ? void 0 : session.event) === null || _a === void 0 ? void 0 : _a.date) || 0)).toLocaleDateString()}\nна мероприятие:\n${(_b = session === null || session === void 0 ? void 0 : session.event) === null || _b === void 0 ? void 0 : _b.name}\nкоторое пройдет в:\n${((_c = session === null || session === void 0 ? void 0 : session.event) === null || _c === void 0 ? void 0 : _c.location) || ''}\n${((_d = session === null || session === void 0 ? void 0 : session.event) === null || _d === void 0 ? void 0 : _d.linc) || ''}`, telegraf_1.Markup.inlineKeyboard([
                            telegraf_1.Markup.button.callback('✅Да', `YES_event_${group}_${eventID}`),
                            telegraf_1.Markup.button.callback('❌Нет', `NO_event_${group}_${eventID}`)
                        ]));
                    }));
                }
                else
                    ctx.reply('Пожалуйста, нажми /start и начни с начала');
            }
            else if (((session === null || session === void 0 ? void 0 : session.make) === 'freeDay') || ((session === null || session === void 0 ? void 0 : session.make) === 'busyDay')) {
                let days = [];
                console.log('add days');
                if (Array.isArray(session === null || session === void 0 ? void 0 : session.result)) {
                    console.log(session);
                    days = session.result.map((item) => { var _a, _b; return Number(new Date(`${(_a = session === null || session === void 0 ? void 0 : session.date) === null || _a === void 0 ? void 0 : _a.year}-${(_b = session === null || session === void 0 ? void 0 : session.date) === null || _b === void 0 ? void 0 : _b.month}-${item}`)); });
                    console.log(days);
                    if (group) {
                        (yield sql_1.default.calendar.setCalendar(days, ctx.from.id, session.make === 'freeDay' ? 1 : (session === null || session === void 0 ? void 0 : session.make) === 'busyDay' ? 2 : null, group));
                        ctx.reply('Выполнено');
                    }
                    else
                        ctx.reply('Пожалуйста, нажми /start и начни с начала');
                }
                else
                    ctx.reply('что-то пошло не так');
            }
            else if ((session === null || session === void 0 ? void 0 : session.make) === 'new group') {
                yield sql_1.default.group.setGroup(ctx.from.id, String(session.result) || 'none', true, true);
                ctx.reply('Создано');
            }
            else if ((session === null || session === void 0 ? void 0 : session.make) === 'search group') {
                console.log(session.result);
                yield sql_1.default.group.setGroup(ctx.from.id, (_e = session === null || session === void 0 ? void 0 : session.result) === null || _e === void 0 ? void 0 : _e.name, false, false, (_f = session === null || session === void 0 ? void 0 : session.result) === null || _f === void 0 ? void 0 : _f.id);
                ctx.reply('Заявка подана');
            }
            console.log((_g = session.event) === null || _g === void 0 ? void 0 : _g.date);
            session = {};
        }
        else if (ctx.callbackQuery.data === 'NO') {
            session = {};
        }
        else if (ctx.callbackQuery.data.includes('YES_event')) {
            console.log(ctx.callbackQuery.data);
            const datas = ctx.callbackQuery.data.split('_');
            yield sql_1.default.event.YNEvent(Number(datas[3]), 1, ctx.from.id, Number(datas[2]));
        }
        else if (ctx.callbackQuery.data.includes('NO_event')) {
            console.log(ctx.callbackQuery.data);
            const datas = ctx.callbackQuery.data.split('_');
            yield sql_1.default.event.YNEvent(Number(datas[3]), 2, ctx.from.id, Number(datas[2]));
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
            else if (command === 'setActiveGroup') {
                const is_admin = yield sql_1.default.user.userCheck(ctx.from.id, commandIndex);
                console.log(is_admin);
                (yield sql_1.default.active.setActiveDate(ctx.from.id, commandIndex)) ?
                    (0, keyboard_1.GroupKeyboard)(ctx, 'Группа задана', commandIndex, typeof (is_admin) === 'boolean' ? false : is_admin.admin) :
                    ctx.reply('Что-то пошло не так');
            }
            console.log(ctx.callbackQuery.data);
        }
        return session;
    });
}
