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
class SQLGroup {
    constructor(connection) {
        this.searchGroup = (id, tgId) => __awaiter(this, void 0, void 0, function* () {
            try {
                return (yield this.connection.query(`select * from GroupsList where Id=${id}`))[0];
            }
            catch (e) {
                console.log(e);
                return false;
            }
        });
        this.getGroup = (tgId) => __awaiter(this, void 0, void 0, function* () {
            try {
                return (yield this.connection.query(`select * from GroupsList where tgId=${tgId} and register=1`))[0];
            }
            catch (e) {
                console.log(e);
                return false;
            }
        });
        this.connection = connection;
    }
    setGroup(id, name, register, admin, groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const maxId = groupId ? groupId : (yield this.connection.query(`select max(Id) from GroupsList`))[0][0]['max(Id)'] + 1;
                yield this.connection.query(`insert GroupsList(Id, tgId, name, admin, register) values(${maxId}, ${id}, "${name}", ${admin ? 1 : 0}, ${register ? 1 : 0})`);
                return true;
            }
            catch (e) {
                console.log(e);
                return false;
            }
        });
    }
}
exports.default = SQLGroup;
