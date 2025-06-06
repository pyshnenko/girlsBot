import { Markup } from 'telegraf';


export function GroupKeyboard(ctx: any, text: string, session: any, admin?: boolean) {
    console.log('keyboard')
    console.log(session)

    let firstLine = admin ?  [
            {text: 'Список пользователей', web_app: {url: `https://spamigor.ru/vika2/users?id=${ctx.from.id}&group=${session?.activeGroup}`}},
            {text: 'Календарь', web_app: {url: `https://spamigor.ru/vika2/events?id=${ctx.from.id}&group=${session?.activeGroup}`}},
            {text: 'Создать событие'}
        ] :
        [
            {text: 'Календарь', web_app: {url: `https://spamigor.ru/vika2/events?id=${ctx.from.id}&group=${session?.activeGroup}`}}
        ]

    ctx.replyWithHTML(text, Markup.keyboard([
        firstLine,
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