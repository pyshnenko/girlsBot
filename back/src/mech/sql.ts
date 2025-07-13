import * as dotenv from 'dotenv';
dotenv.config();
import mysql from "mysql2";
import {SQLgroupSEQ} from '@/mech/sqlFuncs/groups';
//import SQLUsers, {SQLusersSEQ} from '@/mech/sqlFuncs/users';
import {SQLeventsSEQ} from '@/mech/sqlFuncs/events';
import {SQLdateListSEQ} from '@/mech/sqlFuncs/calendar';
import {SQLActiveDateSEQ} from '@/mech/sqlFuncs/activeGroup';
import {SQLusersSEQ} from '@/mech/sqlFuncs/users';
import sequelize from '@/mech/sqlFuncs/helpers/seqInit';

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
    calendar: new SQLdateListSEQ(sequelize),
    //event: new SQLEvents(connection),
    event: new SQLeventsSEQ(sequelize),
    user: new SQLusersSEQ(sequelize),
    usertest: new SQLusersSEQ(sequelize),
    group: new SQLgroupSEQ(sequelize),
 //   active: new SQLActiveGroup(connection),
    activeTest: new SQLActiveDateSEQ(sequelize)
}