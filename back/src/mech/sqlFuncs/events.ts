import { Connection } from "mysql2/promise";
import { eventListType } from "../../types/sql";
import { dateToSql } from "../sql";

export default class SQLEvents {
    connection: Connection;

    constructor (connection: Connection) {
        this.connection = connection;
    }

    addEvent = async (authorID: number, namestring: string, dateevent: Date, place: string, linc: string, group: number): Promise<boolean> => {
        try {
            await this.connection.query(`insert eventList(authorID, namestring, dateevent, place, linc, groupID) values(${authorID}, "${namestring}", "${dateToSql(dateevent)}", "${place}", "${linc}", ${group})`)
            return true
        } catch (e: any) {
            console.log(e)
            return false
        }
    }

    updEvent = async (id: number, namestring: string, dateevent: Date, place: string, linc: string, group: number): Promise<boolean> => {
        try {
            await this.connection.query(`UPDATE eventList set namestring="${namestring}", dateevent="${dateToSql(dateevent)}", place="${place}", linc="${linc}" where id=${id} and grpupID=${group}`)
            return true
        } catch (e: any) {
            console.log(e)
            return false
        }
    }

    YNEvent = async (id: number, result: 1|2|null, tgid: number, group: number): Promise<boolean> => {
        try {
            const event = (await this.connection.query(`SELECT * from eventList where id=${id} and groupID=${group}`))[0] as any
            console.log(event)
            if (event[0].hasOwnProperty(`id${tgid}`))
                await this.connection.query(`UPDATE eventList set id${tgid}=${result} where id=${id} and groupID=${group}`)
            else {
                await this.connection.query(`alter table eventList add id${tgid} int default 0`)
                await this.connection.query(`UPDATE eventList set id${tgid}=${result} where id=${id} and groupID=${group}`)
            }
            return true
        } catch (e: any) {
            console.log(e)
            return false
        }
    }
    
    delEvent = async (id: number, group: number): Promise<boolean> => {
        try {
            await this.connection.query(`DELETE FROM eventList where id=${id} and groupID=${group}`)
            return true
        } catch (e: any) {
            console.log(e)
            return false
        }
    }
    
    getEvent = async (group: number, from: Date, to?: Date): Promise<eventListType[] | null> => {
        try {
            const ask = await this.connection.query(
                to ? `select * from eventList where dateevent>"${dateToSql(from)}" and dateevent<"${dateToSql(to)} and groupID=${group} order by dateevent"` : 
                `select * from eventList where dateevent>"${dateToSql(from)}" and groupID=${group}`)
            //console.log(ask)
            return (ask)[0] as eventListType[]
        } catch (e: any) {
            console.log('err')
            return null
        }
    }
}