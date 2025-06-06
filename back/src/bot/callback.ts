import { Context, Session } from "../types/bot";
import { GroupKeyboard } from "../mech/keyboard";
import sql from "../mech/sql";

export default async function callback(ctx: Context, session: Session) {
    //let session = {...ctx.session};
    ctx.deleteMessage();
    if (ctx.callbackQuery.data === 'YES') {
        if (session?.make === 'newEvent') {
            if (session.activeGroup) {
                await sql.event.addEvent(ctx.from.id, session?.event?.name||'', new Date(session?.event?.date||0), '', '', session.activeGroup)
                ctx.reply('добавлено')
            }
            else ctx.reply('Пожалуйста, нажми /start и начни с начала')
        }
        else if ((session?.make === 'freeDay') || (session?.make === 'busyDay')) {
            let days: number[] = []
            console.log('add days')
            if (Array.isArray(session?.result)) {
                console.log(session)
                days = session.result.map((item: string)=>Number(new Date(`${session?.date?.year}-${session?.date?.month}-${item}`)))
                console.log(days)
                if (session.activeGroup) {
                    (await sql.calendar.setCalendar(days, ctx.from.id, session.make === 'freeDay'?1:session?.make === 'busyDay'?2:null, session?.activeGroup))
                    ctx.reply('Выполнено')
                }
                else ctx.reply('Пожалуйста, нажми /start и начни с начала')
            }
            else ctx.reply('что-то пошло не так')
        }
        else if (session?.make === 'new group') {
            await sql.group.setGroup(ctx.from.id, String(session.result)||'none', true, true);
            ctx.reply('Создано')
        }
        else if (session?.make === 'search group') {
            await sql.group.setGroup(ctx.from.id, session?.result?.name, false, false, session?.result?.id);
            ctx.reply('Создано')
        }
        console.log(session.event?.date)
        session = {activeGroup: session.activeGroup}
    } else if (ctx.callbackQuery.data === 'NO') {
        session = {activeGroup: session.activeGroup}
    } else {
        const dataSplit: string[] = ctx.callbackQuery.data.split('_')
        const command = dataSplit[0];
        const commandIndex = Number(dataSplit[1]);
        console.log(commandIndex)
        if (command === 'setFreeDayMonth') {
            const month = ((new Date()).getMonth() + commandIndex + 1)
            session.make = 'freeDay';
            session.await = 'day'
            session.date = {year: month > 11 ? (new Date()).getFullYear() + 1 : (new Date()).getFullYear(), month: month%12, day: 0}
            ctx.reply('Введи даты через пробел или запятую. Например: 1, 2,3 4')
        }
        else if (command === 'setBusyDayMonth') {
            const month = ((new Date()).getMonth() + commandIndex + 1)
            session.make = 'busyDay';
            session.await = 'day'
            session.date = {year: month > 11 ? (new Date()).getFullYear() + 1 : (new Date()).getFullYear(), month: month%12, day: 0}
            ctx.reply('Введи даты через пробел или запятую. Например: 1, 2,3 4')
        }
        else if (command === 'setActiveGroup') {
            session={activeGroup:commandIndex};
            GroupKeyboard(ctx, 'Группа задана', session)
        }
        console.log(ctx.callbackQuery.data)
    }
    ctx.session = session
}