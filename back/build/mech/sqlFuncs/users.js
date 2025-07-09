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
class SQLUsers {
    constructor(connection) {
        this.userAdd = (group, id, admin, register, tgData) => __awaiter(this, void 0, void 0, function* () {
            console.log(group);
            try {
                let userInGroup = group === null ? [] :
                    (yield this.connection.query(`select * from GroupsList join UsersList on GroupsList.tgId=UsersList.id where tgId=${id} and GroupsList.Id=${group.id}`))[0];
                console.log(userInGroup);
                if (!userInGroup.length) {
                    const userLibs = (yield this.connection.query(`select * from UsersList where id=${id}`))[0];
                    if (!userLibs.length) {
                        yield this.connection.query(`insert UsersList(id, isBot, first_name, last_name, username, language_code, is_premium) values (${id}, ${(tgData === null || tgData === void 0 ? void 0 : tgData.is_bot) || false}, "${(tgData === null || tgData === void 0 ? void 0 : tgData.first_name) || 'noName'}", "${(tgData === null || tgData === void 0 ? void 0 : tgData.last_name) || 'noLname'}", "${(tgData === null || tgData === void 0 ? void 0 : tgData.username) || 'noUname'}", "${tgData.language_code || 'noCode'}", ${(tgData === null || tgData === void 0 ? void 0 : tgData.is_premium) === true})`);
                    }
                    if (group) {
                        yield this.connection.query(`insert GroupsList(name, tgId, admin, register, Id) values("${group.name}", ${id}, ${admin ? 1 : 0}, ${register ? 1 : 0}, ${group.id})`);
                    }
                    try {
                        yield this.connection.query(`alter table eventList add column id${id} bool default 0`);
                    }
                    catch (e) { }
                    try {
                        yield this.connection.query(`alter table dayList add column id${id} bool default 0`);
                    }
                    catch (e) { }
                }
                else if (group) {
                    if (Boolean(userInGroup[0].register) !== register) {
                        yield this.connection.query(`update GroupsList set register=${register ? 1 : 0} where Id=${group.id} and tgId=${id}`);
                    }
                    if (Boolean(userInGroup[0].admin) !== admin) {
                        yield this.connection.query(`update GroupsList set admin=${admin ? 1 : 0} where Id=${group.id} and tgId=${id}`);
                    }
                }
            }
            catch (e) {
                console.log(e);
            }
        });
        this.userSearch = (data, groupId) => __awaiter(this, void 0, void 0, function* () {
            if (!(data === null || data === void 0 ? void 0 : data.dataFields))
                data.dataFields = '*';
            try {
                let queryString = '';
                if (groupId) {
                    if (data === null || data === void 0 ? void 0 : data.id)
                        queryString = `select ${data.dataFields} from GroupsList join UsersList on GroupsList.tgId=UsersList.id where GroupsList.Id=${groupId} and UsersList.id=${data.id}`;
                    else if (data === null || data === void 0 ? void 0 : data.register)
                        queryString = `select ${data.dataFields} from GroupsList join UsersList on GroupsList.tgId=UsersList.id where GroupsList.Id=${groupId} and GroupsList.register=true`;
                    else if (data === null || data === void 0 ? void 0 : data.admin)
                        queryString = `select ${data.dataFields} from GroupsList join UsersList on GroupsList.tgId=UsersList.id where GroupsList.Id=${groupId} and GroupsList.admin=true`;
                    else
                        queryString = `select ${data.dataFields} from GroupsList join UsersList on GroupsList.tgId=UsersList.id where GroupsList.Id=${groupId}`;
                }
                else
                    queryString = `select * from UsersList`;
                let hist = yield this.connection.query(queryString);
                if (!hist[0].length)
                    return false;
                else
                    return hist[0];
            }
            catch (e) {
                console.log(e);
                return false;
            }
        });
        this.userCheck = (id, group) => __awaiter(this, void 0, void 0, function* () {
            try {
                let hist = [];
                if (group)
                    hist = yield this.connection.query(`select register, admin from GroupsList join UsersList on GroupsList.tgId=UsersList.id where GroupsList.tgId=${id} and GroupsList.Id=${group}`);
                else
                    hist = yield this.connection.query(`select * from UsersList where id=${id}`);
                if (!hist[0].length)
                    return false;
                else if (group)
                    return hist[0][0];
                else
                    return true;
            }
            catch (e) {
                console.log(e);
                return false;
            }
            finally {
            }
        });
        this.delUser = (id, groupId) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.connection.query(`DELETE FROM GroupsList where tgId=${id} and Id=${groupId}`);
                const otherLists = (yield this.connection.query(`select * from GroupsList where tgId=${id}`))[0];
                if (!otherLists.length) {
                    yield this.connection.query(`DELETE FROM UsersList where id=${id}`);
                    yield this.connection.query(`alter table eventList drop column id${id}`);
                    yield this.connection.query(`alter table dayList drop column id${id}`);
                }
                return true;
            }
            catch (e) {
                console.log(e);
                return (e === null || e === void 0 ? void 0 : e.errno) === 1091 ? true : false;
            }
        });
        this.connection = connection;
    }
}
exports.default = SQLUsers;
