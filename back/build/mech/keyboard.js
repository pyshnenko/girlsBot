"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupKeyboard = GroupKeyboard;
exports.YNKeyboard = YNKeyboard;
exports.searchGroupKeyboard = searchGroupKeyboard;
const telegraf_1 = require("telegraf");
const keyboardButtonsCreater_1 = __importDefault(require("@/mech/helpers/keyboardButtonsCreater"));
function GroupKeyboard(ctx, text, group, admin) {
    ctx.replyWithHTML(text, telegraf_1.Markup.keyboard((0, keyboardButtonsCreater_1.default)(ctx.from.id, group, admin || false)).resize());
}
function YNKeyboard(ctx, text) {
    ctx.replyWithHTML(text, telegraf_1.Markup.inlineKeyboard([
        telegraf_1.Markup.button.callback('✅Да', 'YES'),
        telegraf_1.Markup.button.callback('❌Нет', 'NO')
    ]));
}
function searchGroupKeyboard(ctx, text) {
    ctx.replyWithHTML(text || 'Добро пожаловать в согласовальню!', telegraf_1.Markup.keyboard([
        [
            { text: '🧾Выбрать группу из имеющихся у Вас' }
        ],
        [
            { text: '➕Создать группу' },
            { text: '🔎Найти группу' }
        ]
    ]).resize());
}
