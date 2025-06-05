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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
exports.dateToSql = dateToSql;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const mysql2_1 = __importDefault(require("mysql2"));
const groups_1 = __importDefault(require("./sqlFuncs/groups"));
const users_1 = __importDefault(require("./sqlFuncs/users"));
const events_1 = __importDefault(require("./sqlFuncs/events"));
const calendar_1 = __importDefault(require("./sqlFuncs/calendar"));
exports.connection = mysql2_1.default.createConnection({
    host: String(process.env.SQLHOST),
    port: 3306,
    user: String(process.env.SQLLOGIN),
    database: "vikaGirls",
    password: String(process.env.SQLPASS)
}).promise();
function dateToSql(date, needTime) {
    let nDate = date;
    nDate.setMinutes(nDate.getMinutes() + 1);
    //console.log(nDate.toLocaleString())
    if (!needTime)
        return `${nDate.getFullYear()}-${nDate.getMonth() + 1}-${nDate.getDate()}`;
    else
        return `${nDate.getFullYear()}-${nDate.getMonth() + 1}-${nDate.getDate()} ${nDate.getHours()}:${nDate.getMinutes()}:00`;
}
//daylist {
//  id: number,
//  tgId: number,
//  free: boolean,
//  evtDate: string,
//  daypart: daypart
//}
exports.default = {
    dateToSql,
    calendar: new calendar_1.default(exports.connection),
    event: new events_1.default(exports.connection),
    user: new users_1.default(exports.connection),
    group: new groups_1.default(exports.connection)
};
