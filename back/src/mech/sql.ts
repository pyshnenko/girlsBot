import * as dotenv from 'dotenv';
dotenv.config();
import mysql from "mysql2";
import SQLGroup from './sqlFuncs/groups';
import SQLUsers from './sqlFuncs/users';
import SQLEvents from './sqlFuncs/events';
import SQLCalendar from './sqlFuncs/calendar';

export const connection = mysql.createConnection({
    host: String(process.env.SQLHOST),
    port: 3306,
    user: String(process.env.SQLLOGIN),
    database: "vikaGirls",
    password: String(process.env.SQLPASS)
}).promise();

export function dateToSql(date: Date, needTime?: boolean) {
    let nDate: Date = date;
    nDate.setMinutes(nDate.getMinutes()+1);
    //console.log(nDate.toLocaleString())
    if (!needTime) return `${nDate.getFullYear()}-${nDate.getMonth()+1}-${nDate.getDate()}`
    else return `${nDate.getFullYear()}-${nDate.getMonth()+1}-${nDate.getDate()} ${nDate.getHours()}:${nDate.getMinutes()}:00`
}

//daylist {
//  id: number,
//  tgId: number,
//  free: boolean,
//  evtDate: string,
//  daypart: daypart
//}

export default {
    dateToSql,
    calendar: new SQLCalendar(connection),
    event: new SQLEvents(connection),
    user: new SQLUsers(connection),
    group: new SQLGroup(connection)
}