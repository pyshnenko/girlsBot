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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = checkAuth;
const sql_1 = __importDefault(require("./sql"));
function checkAuth(tok_1) {
    return __awaiter(this, arguments, void 0, function* (tok, admin = false) {
        const userId = Number((tok === null || tok === void 0 ? void 0 : tok.slice(7)) || 0);
        if (!userId)
            return { code: 401 };
        else {
            const sqlCheck = yield sql_1.default.userCheck(userId);
            if (sqlCheck === false)
                return { code: 401 };
            else if (sqlCheck !== true && !sqlCheck.is_admin)
                return admin ? { code: 403 } : { code: 200, tg: sqlCheck, id: userId };
            else {
                return sqlCheck === true ? { code: 200, id: userId } : { code: 200, tg: sqlCheck, id: userId };
            }
        }
    });
}
