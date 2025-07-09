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
Object.defineProperty(exports, "__esModule", { value: true });
const sql_1 = require("@/mech/sql");
class SQLCalendar {
    constructor(connection) {
        this.getCalendar = (from, to, group) => __awaiter(this, void 0, void 0, function* () {
            try {
                const idList = (yield this.connection.query(`select tgId from GroupsList where Id=${group}`))[0]
                    .map((item) => `id${item.tgId}`);
                let queryParam = idList.join(',') + ', id, evtDate, groupID, free, daypart';
                return (yield this.connection.query(`select ${queryParam} from dayList where evtDate>="${(0, sql_1.dateToSql)(from)}" and evtDate<="${(0, sql_1.dateToSql)(to)}" and groupID=${group} order by evtDate`))[0];
            }
            catch (e) {
                console.log(e);
                return null;
            }
        });
        this.setCalendar = (date, id, status, group) => __awaiter(this, void 0, void 0, function* () {
            console.log('date');
            console.log(date);
            try {
                for (let i = 0; i < date.length; i++) {
                    console.log(i);
                    let dateNotes = (yield this.connection.query(`select * from dayList where evtDate="${(0, sql_1.dateToSql)(new Date(date[i]))}" and groupID=${group}`))[0];
                    console.log(dateNotes);
                    if (!dateNotes.length) {
                        console.log('length = 0');
                        yield this.connection.query(`insert dayList(evtDate, groupID) values("${(0, sql_1.dateToSql)(new Date(date[i]))}", ${group})`);
                        console.log('length = 01');
                        dateNotes = (yield this.connection.query(`select * from dayList where evtDate="${(0, sql_1.dateToSql)(new Date(date[i]))}" and groupID=${group}`))[0];
                        console.log(dateNotes);
                    }
                    if (dateNotes.length && dateNotes[0].hasOwnProperty(`id${id}`)) {
                        console.log('length != 0');
                        yield this.connection.query(`update dayList set id${id}=${status} where id=${dateNotes[0].id} and groupID=${group}`);
                    }
                    else if (dateNotes.length && !dateNotes[0].hasOwnProperty(`id${id}`)) {
                        console.log('add column');
                        yield this.connection.query(`alter table dayList add id${id} int default 0`);
                        yield this.connection.query(`update dayList set id${id}=${status} where id=${dateNotes[0].id} and groupID=${group}`);
                    }
                }
                return true;
            }
            catch (e) {
                return false;
            }
        });
        this.connection = connection;
    }
}
exports.default = SQLCalendar;
