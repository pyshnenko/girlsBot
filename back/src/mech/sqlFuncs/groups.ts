import { Connection } from "mysql2/promise";
import { groupSearchResult } from "../../types/sql";

export default class SQLGroup {
    connection: Connection;
    constructor(connection: Connection) {
        this.connection = connection;
    }

    async setGroup(id: number, name: string, register: boolean, admin: boolean, groupId?: number): Promise<boolean> {
        try {
            const maxId = groupId?groupId:((await this.connection.query(`select max(Id) from GroupsList`))[0] as {'max(Id)': number}[])[0]['max(Id)']+1;
            await this.connection.query(`insert GroupsList(Id, tgId, name, admin, register) values(${maxId}, ${id}, "${name}", ${admin?1:0}, ${register?1:0})`)
            return true
        } catch(e: any) {
            console.log(e)
            return false
        }
    }
    searchGroup = async (id: number, tgId: number): Promise<false|groupSearchResult[]> => {
        try {
            return ((await this.connection.query(`select * from GroupsList where Id=${id}`))[0] as groupSearchResult[])
        } catch(e: any) {
            console.log(e)
            return false
        }
    }
    
    getGroup = async (tgId: number): Promise<false|groupSearchResult[]> => {
        try {
            return ((await this.connection.query(`select * from GroupsList where tgId=${tgId} and register=1`))[0] as groupSearchResult[])
        } catch(e: any) {
            console.log(e)
            return false
        }
    }
}