"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.addEvent = exports.askAllAdmin = exports.userCheck = exports.userSearch = exports.userAdd = exports.connection = void 0;
exports.dateToSql = dateToSql;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const mysql2_1 = __importDefault(require("mysql2"));
exports.connection = mysql2_1.default.createConnection({
    host: String(process.env.SQLHOST),
    port: 3306,
    user: String(process.env.SQLLOGIN),
    database: "vikaGirls",
    password: String(process.env.SQLPASS)
}).promise();
const userAdd = (id, admin, register, tgData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let hist = yield exports.connection.query(`select * from UsersList where id = ${id}`);
        if (!hist[0].length)
            yield exports.connection.query(`insert UsersList(id, isBot, first_name, last_name, username, language_code, is_premium, is_admin, register) values (${id}, ${(tgData === null || tgData === void 0 ? void 0 : tgData.is_bot) || false}, "${(tgData === null || tgData === void 0 ? void 0 : tgData.first_name) || 'noName'}", "${(tgData === null || tgData === void 0 ? void 0 : tgData.last_name) || 'noLname'}", "${(tgData === null || tgData === void 0 ? void 0 : tgData.username) || 'noUname'}", "${tgData.language_code || 'noCode'}", ${(tgData === null || tgData === void 0 ? void 0 : tgData.is_premium) === true}, ${admin}, ${register})`);
        else if (hist[0].admin !== admin)
            yield exports.connection.query(`update UsersList set admin = ${admin} where id = ${id}`);
        //console.log(hist[0]);
    }
    catch (e) {
        console.log(e);
    }
});
exports.userAdd = userAdd;
function dateToSql(date, needTime) {
    let nDate = date;
    nDate.setMinutes(nDate.getMinutes() + 1);
    //console.log(nDate.toLocaleString())
    if (!needTime)
        return `${nDate.getFullYear()}-${nDate.getMonth() + 1}-${nDate.getDate()}`;
    else
        return `${nDate.getFullYear()}-${nDate.getMonth() + 1}-${nDate.getDate()} ${nDate.getHours()}:${nDate.getMinutes()}:00`;
}
const userSearch = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(data === null || data === void 0 ? void 0 : data.dataFields))
        data.dataFields = '*';
    try {
        let queryString = '';
        if (data === null || data === void 0 ? void 0 : data.id)
            queryString = `select ${data.dataFields} from UsersList where id = ${data.id}`;
        else if (data === null || data === void 0 ? void 0 : data.register)
            queryString = `select ${data.dataFields} from UsersList where register = true`;
        else if (data === null || data === void 0 ? void 0 : data.admin)
            queryString = `select ${data.dataFields} from UsersList where is_admin = true`;
        else
            queryString = `select ${data.dataFields} from UsersList`;
        let hist = yield exports.connection.query(queryString);
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
exports.userSearch = userSearch;
const userCheck = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let hist = yield exports.connection.query(`select register, is_admin from UsersList where id = ${id}`);
        if (!hist[0].length)
            return false;
        else
            return hist[0][0];
    }
    catch (e) {
        console.log(e);
        return false;
    }
    finally {
    }
});
exports.userCheck = userCheck;
const askAllAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return (yield exports.connection.query(`select id from UsersList where is_admin = true`));
    }
    catch (e) {
        console.log(e);
        return [];
    }
});
exports.askAllAdmin = askAllAdmin;
const addEvent = (authorID, namestring, dateevent) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return (yield exports.connection.query(`insert eventList(authorID, namestring, dateevent) values(${authorID}, "${namestring}", "${dateevent}")`));
    }
    catch (e) {
        console.log(e);
        return false;
    }
});
exports.addEvent = addEvent;
//eventList: {
// id: number,
// authorID: number,
// namestring: string,
// dateevent: string
//daylist {
//  id: number,
//  tgId: number,
//  free: boolean,
//  evtDate: string,
//  daypart: daypart
//}
exports.default = {
    userAdd: exports.userAdd,
    dateToSql,
    userSearch: exports.userSearch,
    userCheck: exports.userCheck,
    askAllAdmin: exports.askAllAdmin,
    addEvent: exports.addEvent
};
