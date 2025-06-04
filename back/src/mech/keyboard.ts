import { Markup } from 'telegraf';


export function GroupKeyboard(ctx: any, text: string) {

    ctx.replyWithHTML(text, Markup.keyboard([
        [
            {text: 'Список пользователей', web_app: {url: `https://spamigor.ru/vika2/users?id=${ctx.from.id}&group=${ctx.session?.activeGroup}`}},
            {text: 'Календарь', web_app: {url: `https://spamigor.ru/vika2/events?id=${ctx.from.id}&group=${ctx.session?.activeGroup}`}},
            {text: 'Создать событие'}
        ],
        [
            {text: 'Добавить свободные даты в календарь'},
            {text: 'Добавить занятые даты в календарь'}
        ]
    ]))
}
export function YNKeyboard(ctx: any, text: string) {

    ctx.replyWithHTML(text,
        Markup.inlineKeyboard([
            Markup.button.callback('Да', 'YES'),
            Markup.button.callback('Нет', 'NO')
        ])
    )
}