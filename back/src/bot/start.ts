import { Context } from "../types/bot";
import { TGCheck } from "../types/tgTypes";
import { Markup } from "telegraf";
import sql from "../mech/sql";

export default async function start(ctx: Context) {
    console.log('start')
    ctx.session = {};
    let checkUser: boolean | TGCheck = await sql.user.userCheck(ctx.from.id);
    if (checkUser === false) {
        sql.user.userAdd(null, ctx.from.id, false, false, ctx.from);
    }
    ctx.replyWithHTML('Добро пожаловать в согласовальню!', 
        Markup.keyboard([
            [
                {text: 'Выбрать группу из имеющихся у Вас'}
            ],
            [
                {text: 'Создать группу'},
                {text: 'Найти группу'}
            ]
        ])
    )
}