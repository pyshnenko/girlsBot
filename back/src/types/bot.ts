import { Context as TGContext } from 'telegraf';
import { TGFrom } from 'types/tgTypes';
import { CallbackQuery, Message } from 'telegraf/typings/core/types/typegram';

export type Session = {
    event?: {
        name?: string,
        location?: string,
        linc?: string,
        date: Date|number|string
    },
    date?: {
        year: number,
        month: number,
        day: number
    },
    make?: string,
    result?: any,
    //activeGroup?: number,
    await?: string

}

export type Context = TGContext & {
    session: Session,
    from: TGFrom,
    callbackQuery: CallbackQuery.DataQuery,
    message: Message.TextMessage
}