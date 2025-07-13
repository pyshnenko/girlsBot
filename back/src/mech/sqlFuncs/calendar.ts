import { Connection } from "mysql2/promise";
import { calendar } from "@/types/sql";
import { dateToSql } from "@/mech/sql";
import SEQabsClass from "./helpers/SEQabsClass";
import { Sequelize, Op } from "sequelize";
import {logger} from '@/winston/logger';
import sql from '@/mech/sql';
import { WhereOptions } from "sequelize";
import { DaysAttributes } from "@/models/dayList";
import sqdDataToCalendar from "./helpers/sqlDataToCalendar";

export class SQLdateListSEQ extends SEQabsClass {
    model
    constructor (sequelize: Sequelize) {
        super(sequelize)
        this.model = this._init.initDayListNew()
    }
    async get(groupId: number|null, date: Date, dateTo?: Date, tgId?: number) {
        try {
            if (!groupId) return []
            let whereObj: WhereOptions<DaysAttributes>|{tgId: number} = {}
            if (dateTo) {whereObj={
                evtDate: {
                    [Op.gte]: date.toISOString(),
                    [Op.lte]: dateTo.toISOString()
                }
            }} else {whereObj={evtDate: date.toISOString()}}
            if (tgId) whereObj={...whereObj, tgId}
            const aData = await this.model.findAll({
                raw: true, 
                where: {...whereObj, groupId}
            })
            return sqdDataToCalendar(aData)
        } catch(e) {logger.log('warning', e); return []}
    }
    async set(evtDate: Date[], tgId: number, res: boolean, groupID: number) {
        try {
            evtDate.forEach(async (date:Date)=> {
                const checkData = await this.get(groupID, date, undefined, tgId);
                if (checkData.length>0) {
                    await this.model.update({
                        free: res
                    }, {
                        where: {
                            tgId,
                            evtDate: date.toISOString(),
                            groupId: groupID
                        }
                    })
                    return true
                }
                else {
                    await this.model.create({
                        evtDate: date.toISOString(),
                        tgId: tgId,
                        free: res,
                        groupId: groupID
                    })
                    return true
                }
            })
        }
        catch(e) {logger.log('warning', e); return false}
    }
}

/*export class SQLCalendar {
    connection: Connection;

    constructor (connection: Connection) {
        this.connection = connection;
    }

    getCalendar = async (from: Date, to: Date, group: number): Promise<calendar[] | null> => {
        try {
            const idList: string[] = ((await this.connection.query(`select tgId from GroupsList where Id=${group}`))[0] as {tgId: number}[])
                .map((item:{tgId: number})=>`id${item.tgId}`);
            let queryParam: string = idList.join(',') + ', id, evtDate, groupID, free, daypart';
            return (await this.connection.query(`select ${queryParam} from dayList where evtDate>="${dateToSql(from)}" and evtDate<="${dateToSql(to)}" and groupID=${group} order by evtDate`))[0] as calendar[]
        }
        catch (e: any) {
            console.log(e)
            return null
        }
    }

    setCalendar = async (date: number[], id: number, status: 1|2|null, group: number): Promise<boolean> => {
        console.log('date')
        console.log(date)
        try {
            for (let i = 0; i<date.length; i++) {
                console.log(i)
                let dateNotes: calendar[] = (await this.connection.query(`select * from dayList where evtDate="${dateToSql(new Date(date[i]))}" and groupID=${group}`))[0] as calendar[]
                console.log(dateNotes)
                if (!dateNotes.length) {
                    console.log('length = 0')
                    await this.connection.query(`insert dayList(evtDate, groupID) values("${dateToSql(new Date(date[i]))}", ${group})`)
                    console.log('length = 01')
                    dateNotes = (await this.connection.query(`select * from dayList where evtDate="${dateToSql(new Date(date[i]))}" and groupID=${group}`))[0] as any[]
                    console.log(dateNotes)
                }
                if (dateNotes.length && dateNotes[0].hasOwnProperty(`id${id}`)) {
                    console.log('length != 0')
                    await this.connection.query(`update dayList set id${id}=${status} where id=${dateNotes[0].id} and groupID=${group}`)
                }
                else if (dateNotes.length && !dateNotes[0].hasOwnProperty(`id${id}`)) {
                    console.log('add column')
                    await this.connection.query(`alter table dayList add id${id} int default 0`)
                    await this.connection.query(`update dayList set id${id}=${status} where id=${dateNotes[0].id} and groupID=${group}`)
                }
            }
            return true
        }
        catch(e) {
            return false
        }
    }
}*/