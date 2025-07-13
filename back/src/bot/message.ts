import { Context, Session } from "@/types/bot";
import { Markup, Telegraf } from "telegraf";
import { GroupKeyboard, searchGroupKeyboard } from "@/mech/keyboard";
import { TGCheck, TGFrom } from "@/types/tgTypes";
import { GroupsAttr } from "@/types/sql";
import { getMonth } from "@/consts/tg";
import { YNKeyboard } from "@/mech/keyboard";
import sql from "@/mech/sql";

export default async function message(ctx: Context, session: Session, bot: Telegraf) {
    //let session = {...ctx.session};
    let checkUser: boolean | TGCheck = await sql.user.check(ctx.from.id);
    switch (ctx.message.text) {
        case '/info': {
            ctx.reply(Math.floor(Math.random()*10)%2?'Там-сям, туда-сюда':'Сбожьей помощью');
            break;
        }
        case '/tariff': {
            ctx.reply('Наш единственный разработчик нуждается в поддержке');
            break;
        }
        case '/support': {
            ctx.reply(Math.floor(Math.random()*10)%2?'*нежно похлопываю вас по плечу*':'Мы верим в тебя!!!!');
            break;
        }
        case '➕Создать группу': {
            session = {make: "new group"};
            ctx.reply('Введи название группы');
            break;
        }
        case 'Выбрать другую группу': {
            sql.activeTest.set(ctx.from.id, 0);
            searchGroupKeyboard(ctx, 'Давай выберем другую группу')
            break;
        }
        case '🔎Найти группу': {
            session = {make: "search group"};
            ctx.reply('Введи id группы (узнать его можно у создателя группы)');
            break;
        }
        case '🧾Выбрать группу из имеющихся у Вас': {
            session = {};
            const groups = await sql.group.get(ctx.from.id)
            console.log(groups)
            if (!groups) ctx.reply('что-то пошло не так. нажми /start')
            else {
                ctx.replyWithHTML('Выбери группу',
                    Markup.inlineKeyboard(groups.map((item: GroupsAttr)=>
                        Markup.button.callback(item.name, `setActiveGroup_${item.Id}`)))
                )
            }
            break;
        }
        case '➕Создать событие': {
            if ((typeof(checkUser)!=='boolean')||checkUser===true) {
                ctx.reply('Введи название события')
                //session = {activeGroup: session.activeGroup};
                session.make = 'newEvent';
                session.await = 'name';
            } else ctx.reply('обратись к администратору')
            break;
        }
        case '🖌Добавить свободные даты в календарь': {
            //session = {activeGroup: session.activeGroup};
            ctx.replyWithHTML('Выбери месяц',
                Markup.inlineKeyboard([
                    Markup.button.callback(getMonth((new Date()).getMonth()), 'setFreeDayMonth_0'),
                    Markup.button.callback(getMonth((new Date()).getMonth() + 1), 'setFreeDayMonth_1'),
                    Markup.button.callback(getMonth((new Date()).getMonth() + 2), 'setFreeDayMonth_2')
                ])
            )
            break;
        }
        case '🖍Добавить занятые даты в календарь': {
            //session = {activeGroup: session.activeGroup};
            ctx.replyWithHTML('Выбери месяц',
                Markup.inlineKeyboard([
                    Markup.button.callback(getMonth((new Date()).getMonth()), 'setBusyDayMonth_0'),
                    Markup.button.callback(getMonth((new Date()).getMonth() + 1), 'setBusyDayMonth_1'),
                    Markup.button.callback(getMonth((new Date()).getMonth() + 2), 'setBusyDayMonth_2')
                ])
            )
            break;
        }
        default: {
            if (ctx.session?.make === 'newEvent' && ctx.session?.await === 'date') {
                const dateText: string[] = ctx.message.text.replaceAll(' ', '').replaceAll(',', '.').split('.');
                session.event = {...session.event, date: `${dateText[2]}-${dateText[1]}-${dateText[0]}`}
                YNKeyboard(ctx, `Проверь:\n${ctx.session?.event?.name||''}\n`+
                    `${ctx.session?.event?.location||''}\n${ctx.session?.event?.linc||''}\n`+
                    `${(new Date(dateText[2]+'-'+dateText[1]+'-'+dateText[0]).toLocaleDateString())}`)
            }
            else if (ctx.session?.make === 'newEvent' && ctx.session?.await === 'location') {
                session.await = 'date';
                session.event = {name: session.event?.name, location: ctx.message.text, date: '', linc: session.event?.linc}
                ctx.reply(`Введи дату в формате DD.MM.YYYY (через точку). Например: `+
                    `${(new Date().getDate())}.${(new Date().getMonth()+1)}.${(new Date()).getFullYear()}`)
            }
            else if (ctx.session?.make === 'newEvent' && ctx.session?.await === 'linc') {
                session.await = 'location';
                session.event = {name: session.event?.name, location: '', date: '', linc: ctx.message.text}
                ctx.reply(`напиши место проведения события`)
            }
            else if (ctx.session?.make === 'newEvent' && ctx.session?.await === 'name') {
                session.await = 'linc';
                session.event = {name: ctx.message.text, location: '', date: '', linc: ''}
                ctx.reply(`укажи коментарий или ссылку на событие`)
            }
            else if ((ctx.session?.make === 'freeDay') || (ctx.session?.make === 'busyDay')) {
                const dayArray: string[] = ctx.message.text.replaceAll(' ', ',').split(',').filter((item: string)=>Number(item));
                let mess = '';
                session.result = dayArray;
                dayArray.forEach((item: string) => {mess+=(new Date(`${session?.date?.year}-${session?.date?.month}-${item}`).toLocaleDateString())+'\n'})
                YNKeyboard(ctx, mess)
            }
            else if (ctx.session?.make==='search group') {
                const result = await sql.group.search(Number(ctx.message.text))
                if (result) {
                    const searchMe = result.filter((item: GroupsAttr)=>item.tgId===ctx.from.id);
                    if (searchMe.length && searchMe[0].register){
                        delete(session.make);
                        GroupKeyboard(ctx, 'Группа выбрана', searchMe[0].Id, searchMe[0].admin?true:false)
                    }
                    else if (searchMe.length && !searchMe[0].register) {
                        delete(session.make);
                        ctx.reply('Администратор еще не принял решение')
                    }
                    else {
                        session.result={id: Number(ctx.message.text), name: result[0].name};
                        YNKeyboard(ctx, `Подать запрос на вступление в группу "${result[0].name}"?`)
                    }
                }
                else ctx.reply('не найдено')
            }
            else if (ctx.session?.make === 'new group'){
                session.result = ctx.message.text;                
                YNKeyboard(ctx, `Группа будет называться:\n${ctx.message.text}`)
            }
            else if (ctx.message?.text&&ctx.message.text.includes('All') && ctx.from.id===Number(process.env.ADMIN)) {
                const userList = await sql.user.search({},0) as TGFrom[]
                userList.map((item: TGFrom) => bot.telegram.sendMessage(item.id, ctx.message.text.slice(5)))
            }
        }
    }
    return session
}