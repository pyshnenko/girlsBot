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
exports.default = start;
const sql_1 = __importDefault(require("@/mech/sql"));
const keyboard_1 = require("../mech/keyboard");
function start(ctx, session) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('start');
        session = {};
        let checkUser = yield sql_1.default.user.userCheck(ctx.from.id);
        if (checkUser === false) {
            sql_1.default.user.userAdd(null, ctx.from.id, false, false, ctx.from);
        }
        else {
            const group = yield sql_1.default.active.getActiveDate(ctx.from.id);
            console.log(group);
            if (group) {
                checkUser = yield sql_1.default.user.userCheck(ctx.from.id, group);
                (0, keyboard_1.GroupKeyboard)(ctx, 'Держи клавиатурку', group, (typeof (checkUser) === 'object' && checkUser.admin));
            }
            else
                (0, keyboard_1.searchGroupKeyboard)(ctx);
        }
        return session;
    });
}
