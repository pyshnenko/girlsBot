"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.monthName = void 0;
exports.getMonth = getMonth;
exports.monthName = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь'
];
function getMonth(n) {
    return exports.monthName[n % 12];
}
