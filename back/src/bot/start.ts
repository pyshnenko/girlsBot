import { Context, Session } from "../types/bot";
import { TGCheck } from "../types/tgTypes";
import { Markup } from "telegraf";
import sql from "../mech/sql";
import { searchGroupKeyboard, GroupKeyboard } from "../mech/keyboard";

export default async function start(ctx: Context, session: Session): Promise<Session> {
    console.log('start')
    session = {};
    let checkUser: boolean | TGCheck = await sql.user.userCheck(ctx.from.id);
    if (checkUser === false) {
        sql.user.userAdd(null, ctx.from.id, false, false, ctx.from);
    }
    else {
        const group = await sql.active.getActiveDate(ctx.from.id);
        if (group) {
            checkUser = await sql.user.userCheck(ctx.from.id, group);
            GroupKeyboard(ctx, 'Держи клавиатурку', group, (typeof(checkUser)==='object'&&checkUser.admin))
        }
        else searchGroupKeyboard(ctx)
    }
    return session
}