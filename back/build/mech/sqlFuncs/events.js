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
class SQLEvents {
    constructor(connection) {
        this.addEvent = (authorID, namestring, dateevent, place, linc, group) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                yield this.connection.query(`insert eventList(authorID, namestring, dateevent, place, linc, groupID) values(${authorID}, "${namestring}", "${(0, sql_1.dateToSql)(dateevent)}", "${place}", "${linc}", ${group})`);
                return ((_a = (yield this.connection.query(`select id from eventList where authorID=${authorID} and dateevent="${(0, sql_1.dateToSql)(dateevent)}"`))[0][0]) === null || _a === void 0 ? void 0 : _a.id) || false;
            }
            catch (e) {
                console.log(e);
                return false;
            }
        });
        this.updEvent = (id, namestring, dateevent, place, linc, group) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.connection.query(`UPDATE eventList set namestring="${namestring}", dateevent="${(0, sql_1.dateToSql)(dateevent)}", place="${place}", linc="${linc}" where id=${id} and grpupID=${group}`);
                return true;
            }
            catch (e) {
                console.log(e);
                return false;
            }
        });
        this.YNEvent = (id, result, tgid, group) => __awaiter(this, void 0, void 0, function* () {
            try {
                const event = (yield this.connection.query(`SELECT * from eventList where id=${id} and groupID=${group}`))[0];
                console.log(event);
                if (event[0].hasOwnProperty(`id${tgid}`))
                    yield this.connection.query(`UPDATE eventList set id${tgid}=${result} where id=${id} and groupID=${group}`);
                else {
                    yield this.connection.query(`alter table eventList add id${tgid} int default 0`);
                    yield this.connection.query(`UPDATE eventList set id${tgid}=${result} where id=${id} and groupID=${group}`);
                }
                return true;
            }
            catch (e) {
                console.log(e);
                return false;
            }
        });
        this.delEvent = (id, group) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.connection.query(`DELETE FROM eventList where id=${id} and groupID=${group}`);
                return true;
            }
            catch (e) {
                console.log(e);
                return false;
            }
        });
        this.getEvent = (group, from, to) => __awaiter(this, void 0, void 0, function* () {
            try {
                const ask = yield this.connection.query(to ? `select * from eventList where dateevent>"${(0, sql_1.dateToSql)(from)}" and dateevent<"${(0, sql_1.dateToSql)(to)}" and groupID=${group} order by dateevent` :
                    `select * from eventList where dateevent>"${(0, sql_1.dateToSql)(from)}" and groupID=${group}`);
                //console.log(ask)
                return (ask)[0];
            }
            catch (e) {
                console.log('err');
                return null;
            }
        });
        this.connection = connection;
    }
}
exports.default = SQLEvents;
