import { Connection } from "mysql2/promise";

export default class SQLActiveDate {
    connection: Connection;

    constructor (connection: Connection) {
        this.connection = connection;
    }

    getActiveDate = async (id: number): Promise<number | null> => {
        try {
            const aDate: number | null = ((await this.connection.query(`select groupId from ActiveTable where tgId=${id}`))[0] as {groupId: number}[])[0]?.groupId||null;
            const checkGroup = ((await this.connection.query(`select register from GroupsList where tgId=${id} and Id = ${aDate}`))[0] as {register: number}[])[0]?.register||null;
            return checkGroup ? aDate : null
        }
        catch (e: any) {
            console.log(e)
            return null
        }
    }

    setActiveDate = async (id: number, group: number): Promise<boolean> => {
        try {
            await this.connection.query(`update ActiveTable set groupId=${group} where tgId=${id}`)
            return true
        }
        catch(e) {
            try {
                await this.connection.query(`insert ActiveTable(tgId, groupId) values(${id}, ${group})`)
                return true
            }
            catch(e) {
                return false
            }
        }
    }
}