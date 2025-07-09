import { Markup } from 'telegraf';
import keyboardButtonsCreator from '@/mech/helpers/keyboardButtonsCreater';


export function GroupKeyboard(ctx: any, text: string, group: number, admin?: boolean) {    

    ctx.replyWithHTML(text, Markup.keyboard(
        keyboardButtonsCreator(ctx.from.id, group, admin||false)
    ).resize())
}

export function YNKeyboard(ctx: any, text: string) {

    ctx.replyWithHTML(text,
        Markup.inlineKeyboard([
            Markup.button.callback('✅Да', 'YES'),
            Markup.button.callback('❌Нет', 'NO')
        ])
    )
}

export function searchGroupKeyboard (ctx: any, text?: string) {
    ctx.replyWithHTML(text||'Добро пожаловать в согласовальню!', 
        Markup.keyboard([
            [
                {text: '🧾Выбрать группу из имеющихся у Вас'}
            ],
            [
                {text: '➕Создать группу'},
                {text: '🔎Найти группу'}
            ]
        ]).resize()
    )
}