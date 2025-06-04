import * as dotenv from 'dotenv';
dotenv.config();
import mysql from "mysql2";
import { TGFrom, TGCheck, DataForUserSearch } from '../types/tgTypes';
import { eventListType, calendar, groupSearchResult } from '../types/sql';

export const connection = mysql.createConnection({
    host: String(process.env.SQLHOST),
    port: 3306,
    user: String(process.env.SQLLOGIN),
    database: "vikaGirls",
    password: String(process.env.SQLPASS)
}).promise();

export const userAdd = async (id: number, admin: boolean, register: boolean, tgData:TGFrom) => {
    console.log(register)
    try {
        let hist: any[] = await connection.query(`select * from UsersList where id = ${id}`);
        console.log(hist[0])
        if (!hist[0].length) {
            await connection.query(`insert UsersList(id, isBot, first_name, last_name, username, language_code, is_premium, is_admin, register) values (${
        id}, ${tgData?.is_bot||false}, "${tgData?.first_name||'noName'}", "${tgData?.last_name||'noLname'}", "${tgData?.username||'noUname'}", "${tgData.language_code||'noCode'}", ${tgData?.is_premium===true}, ${admin}, ${register})`)
        }
        if (hist[0].length && (Boolean(hist[0][0].admin) !== admin))
            await connection.query(`update UsersList set is_admin = ${admin} where id = ${id}`)
        if (hist[0].length && (!hist[0][0].register) && register) {
            console.log('reg')
            await connection.query(`update UsersList set register = ${register} where id = ${id}`)
            await connection.query(`alter table eventList add id${id} int default 0`)
            await connection.query(`alter table dayList add id${id} int default 0`)
        }
        if (hist[0].length && (hist[0][0].register===1) && !register) {
            console.log('reg')
            await connection.query(`update UsersList set register = ${register} where id = ${id}`)
            await connection.query(`alter table eventList drop column id${id}`)
            await connection.query(`alter table dayList drop column id${id}`)
        }
        //console.log(hist[0]);
    } catch (e: any) {
        console.log(e)
    }
}

export function dateToSql(date: Date, needTime?: boolean) {
    let nDate: Date = date;
    nDate.setMinutes(nDate.getMinutes()+1);
    //console.log(nDate.toLocaleString())
    if (!needTime) return `${nDate.getFullYear()}-${nDate.getMonth()+1}-${nDate.getDate()}`
    else return `${nDate.getFullYear()}-${nDate.getMonth()+1}-${nDate.getDate()} ${nDate.getHours()}:${nDate.getMinutes()}:00`
}

export const userSearch = async (data: DataForUserSearch) => {
    if (!data?.dataFields) data.dataFields = '*';
    try {
        let queryString: string = '';
        if (data?.id) queryString = `select ${data.dataFields} from UsersList where id = ${data.id}`
        else if (data?.register) queryString = `select ${data.dataFields} from UsersList where register = true`
        else if (data?.admin) queryString = `select ${data.dataFields} from UsersList where is_admin = true`
        else queryString = `select ${data.dataFields} from UsersList`
        let hist: any[] = await connection.query(queryString)
        if (!hist[0].length)
            return false
        else return hist[0]
    } catch (e: any) {
        console.log(e)
        return false
    }
}

export const userCheck = async (id: number): Promise<boolean | TGCheck> => {
    try {
        let hist: any[] = await connection.query(`select register, is_admin from UsersList where id = ${id}`);
        if (!hist[0].length)
            return false
        else return hist[0][0] as TGCheck;
    } catch (e: any) {
        console.log(e)
        return false
    } finally {
    }
}

export const delUser = async (id: number): Promise<boolean> => {
    try {
        await connection.query(`DELETE FROM UsersList where id=${id}`)
        await connection.query(`alter table eventList drop column id${id}`)
        await connection.query(`alter table dayList drop column id${id}`)
        return true
    } catch (e: any) {
        console.log(e)
        return e?.errno === 1091 ? true : false
    }
}

export const askAllAdmin = async (): Promise<any> => {
    try {
        return (await connection.query(`select id from UsersList where is_admin = true`));
    } catch (e: any) {
        console.log(e);
        return [];
    }
}

export const addEvent = async (authorID: number, namestring: string, dateevent: Date, place: string, linc: string): Promise<boolean> => {
    try {
        await connection.query(`insert eventList(authorID, namestring, dateevent, place, linc) values(${authorID}, "${namestring}", "${dateToSql(dateevent)}", "${place}", "${linc}")`)
        return true
    } catch (e: any) {
        console.log(e)
        return false
    }
}

export const updEvent = async (id: number, namestring: string, dateevent: Date, place: string, linc: string): Promise<boolean> => {
    try {
        await connection.query(`UPDATE eventList set namestring="${namestring}", dateevent="${dateToSql(dateevent)}", place="${place}", linc="${linc}" where id=${id}`)
        return true
    } catch (e: any) {
        console.log(e)
        return false
    }
}

export const YNEvent = async (id: number, result: 1|2|null, tgid: number): Promise<boolean> => {
    try {
        const event = (await connection.query(`SELECT * from eventList where id=${id}`))[0] as any
        console.log(event)
        if (event[0].hasOwnProperty(`id${tgid}`))
            await connection.query(`UPDATE eventList set id${tgid}=${result} where id=${id}`)
        else {
            await connection.query(`alter table eventList add id${tgid} int default 0`)
            await connection.query(`UPDATE eventList set id${tgid}=${result} where id=${id}`)
        }
        return true
    } catch (e: any) {
        console.log(e)
        return false
    }
}

export const delEvent = async (id: number): Promise<boolean> => {
    try {
        await connection.query(`DELETE FROM eventList where id=${id}`)
        return true
    } catch (e: any) {
        console.log(e)
        return false
    }
}

export const getEvent = async (from: Date, to?: Date): Promise<eventListType[] | null> => {
    try {
        const ask = await connection.query(
            to ? `select * from eventList where dateevent>"${dateToSql(from)}" and dateevent<"${dateToSql(to)} order by dateevent"` : 
            `select * from eventList where dateevent>"${dateToSql(from)}"`)
        //console.log(ask)
        return (ask)[0] as eventListType[]
    } catch (e: any) {
        console.log('err')
        return null
    }
}

export const getCalendar = async (from: Date, to: Date): Promise<calendar[] | null> => {
    try {
        return (await connection.query(`select * from dayList where evtDate>="${dateToSql(from)}" and evtDate<="${dateToSql(to)}" order by evtDate`))[0] as calendar[]
    }
    catch (e: any) {
        return null
    }
}

export const setCalendar = async (date: number[], id: number, status: 1|2|null): Promise<boolean> => {
    console.log('date')
    console.log(date)
    try {
        for (let i = 0; i<date.length; i++) {
            console.log(i)
            let dateNotes: calendar[] = (await connection.query(`select * from dayList where evtDate="${dateToSql(new Date(date[i]))}"`))[0] as calendar[]
            console.log(dateNotes)
            if (!dateNotes.length) {
                console.log('length = 0')
                await connection.query(`insert dayList(evtDate) values("${dateToSql(new Date(date[i]))}")`)
                console.log('length = 01')
                dateNotes = (await connection.query(`select * from dayList where evtDate="${dateToSql(new Date(date[i]))}"`))[0] as any[]
                console.log(dateNotes)
            }
            if (dateNotes.length && dateNotes[0].hasOwnProperty(`id${id}`)) {
                console.log('length != 0')
                await connection.query(`update dayList set id${id}=${status} where id=${dateNotes[0].id}`)
            }
            else if (dateNotes.length && !dateNotes[0].hasOwnProperty(`id${id}`)) {
                console.log('add column')
                await connection.query(`alter table dayList add id${id} int default 0`)
                await connection.query(`update dayList set id${id}=${status} where id=${dateNotes[0].id}`)
            }
        }
        return true
    }
    catch(e) {
        return false
    }
}

export const setGroup = async (id: number, name: string, register: boolean, admin: boolean, groupId?: number): Promise<boolean> => {
    try {
        const maxId = groupId?groupId:((await connection.query(`select max(Id) from GroupsList`))[0] as {'max(Id)': number}[])[0]['max(Id)'];
        await connection.query(`insert GroupsList(Id, tgId, name, admin, register) values(${maxId}, ${id}, "${name}", ${admin?1:0}, ${register?1:0})`)
        return true
    } catch(e: any) {
        console.log(e)
        return false
    }
}

export const searchGroup = async (id: number, tgId: number): Promise<false|groupSearchResult> => {
    try {
        return ((await connection.query(`select * from GroupsList where Id=${id}`))[0] as groupSearchResult[])[0]
    } catch(e: any) {
        console.log(e)
        return false
    }
}

export const getGroup = async (tgId: number): Promise<false|groupSearchResult[]> => {
    try {
        return ((await connection.query(`select * from GroupsList where tgId=${tgId} and register=1`))[0] as groupSearchResult[])
    } catch(e: any) {
        console.log(e)
        return false
    }
}



//daylist {
//  id: number,
//  tgId: number,
//  free: boolean,
//  evtDate: string,
//  daypart: daypart
//}

export default {
    userAdd,
    dateToSql,
    userSearch,
    userCheck,
    askAllAdmin,
    addEvent,
    updEvent,
    delEvent,
    getEvent,
    delUser,
    YNEvent,
    getCalendar,
    setCalendar,
    setGroup,
    searchGroup,
    getGroup
}