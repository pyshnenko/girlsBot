import { Context, Session } from "@/types/bot";
import { TGCheck } from "@/types/tgTypes";
import sql from "@/mech/sql";
import { searchGroupKeyboard, GroupKeyboard } from "../mech/keyboard";

export default async function start(ctx: Context, session: Session): Promise<Session> {
    session = {};
    let checkUser: boolean | TGCheck = await sql.user.check(ctx.from.id);
    if (checkUser === false) {
        sql.user.add(null, ctx.from.id, false, false, ctx.from);
    }
    else {
        const group = await sql.activeTest.get(ctx.from.id);
        if (group) {
            checkUser = await sql.user.check(ctx.from.id, group);
            GroupKeyboard(ctx, 'Держи клавиатурку', group, (typeof(checkUser)==='object'&&checkUser.admin===1))
        }
        else searchGroupKeyboard(ctx)
    }
    return session
}