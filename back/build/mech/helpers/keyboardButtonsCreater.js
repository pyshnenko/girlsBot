"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = keyboardButtonsCreator;
const baseURL_1 = __importDefault(require("@/consts/baseURL"));
function keyboardButtonsCreator(id, group, admin) {
    let firstLine = [
        {
            text: '📆Календарь',
            web_app: { url: baseURL_1.default.botPages.event(id, group) }
        }
    ];
    if (admin) {
        firstLine.push({ text: '📝Список пользователей', web_app: { url: baseURL_1.default.botPages.users(id, group) } });
        firstLine.push({ text: '➕Создать событие' });
    }
    firstLine.push({ text: 'Выбрать другую группу' });
    firstLine.push({ text: '🖌Добавить свободные даты в календарь' });
    firstLine.push({ text: '🖍Добавить занятые даты в календарь' });
    return firstLine;
}
