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
class SQLActiveDate {
    constructor(connection) {
        this.getActiveDate = (id) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const aDate = ((_a = (yield this.connection.query(`select groupId from ActiveTable where tgId=${id}`))[0][0]) === null || _a === void 0 ? void 0 : _a.groupId) || null;
                const checkGroup = ((_b = (yield this.connection.query(`select register from GroupsList where tgId=${id} and Id = ${aDate}`))[0][0]) === null || _b === void 0 ? void 0 : _b.register) || null;
                return checkGroup ? aDate : null;
            }
            catch (e) {
                console.log(e);
                return null;
            }
        });
        this.setActiveDate = (id, group) => __awaiter(this, void 0, void 0, function* () {
            try {
                const checkGroup = (yield this.connection.query(`select groupId from ActiveTable where tgId=${id}`))[0];
                checkGroup.length > 0 ? yield this.connection.query(`update ActiveTable set groupId=${group} where tgId=${id}`) :
                    yield this.connection.query(`insert ActiveTable(tgId, groupId) values(${id}, ${group})`);
                return true;
            }
            catch (e) {
                console.log('error setActiveGroup');
                console.log(e);
                try {
                    yield this.connection.query(`insert ActiveTable(tgId, groupId) values(${id}, ${group})`);
                    return true;
                }
                catch (e) {
                    return false;
                }
            }
        });
        this.connection = connection;
    }
}
exports.default = SQLActiveDate;
