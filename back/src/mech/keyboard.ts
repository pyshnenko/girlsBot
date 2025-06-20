import { Markup } from 'telegraf';


export function GroupKeyboard(ctx: any, text: string, group: number, admin?: boolean) {
    console.log('keyboard')
    console.log(`https://spamigor.ru/vika2/users?id=${ctx.from.id}&group=${group}`)

    let firstLine: {text: string, web_app?: {url: string}}[] = [{text: '📆Календарь', web_app: {url: `https://spamigor.ru/vika2/events?id=${ctx.from.id}&group=${group}`}}]
    if (admin) {
        firstLine.push({text: '📝Список пользователей', web_app: {url: `https://spamigor.ru/vika2/users?id=${ctx.from.id}&group=${group}`}})
        firstLine.push({text: '➕Создать событие'})
    }
    firstLine.push({text: 'Выбрать другую группу'})
    firstLine.push({text: '🖌Добавить свободные даты в календарь'})
    firstLine.push({text: '🖍Добавить занятые даты в календарь'})

    ctx.replyWithHTML(text, Markup.keyboard(
        firstLine
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