import { Connection } from "mysql2/promise";
import { TGFrom, TGCheck, FullTGForm } from "../../types/tgTypes";
import { DataForUserSearch } from "../../types/tgTypes";
import { GroupsSQL } from "../../types/group";
import { groupSearchResult } from "../../types/sql";

export default class SQLUsers {
    connection: Connection;

    constructor (connection: Connection) {
        this.connection = connection;
    }

    userAdd = async (group: {id: number, name: string}|null, id: number, admin: boolean, register: boolean, tgData:TGFrom) => {
        console.log(group)
        try {
            let userInGroup: FullTGForm[] = group===null? [] :
                (await this.connection.query(`select * from GroupsList join UsersList on GroupsList.tgId=UsersList.id where tgId=${id} and GroupsList.Id=${group.id}`))[0] as FullTGForm[]
            console.log(userInGroup)
            if (!userInGroup.length) {
                const userLibs: TGFrom[] = (await this.connection.query(`select * from UsersList where id=${id}`))[0] as TGFrom[];
                if (!userLibs.length) {
                    await this.connection.query(`insert UsersList(id, isBot, first_name, last_name, username, language_code, is_premium) values (${
id}, ${tgData?.is_bot||false}, "${tgData?.first_name||'noName'}", "${tgData?.last_name||'noLname'}", "${tgData?.username||'noUname'}", "${tgData.language_code||'noCode'}", ${tgData?.is_premium===true})`)
                }
                if (group) {
                    await this.connection.query(`insert GroupsList(name, tgId, admin, register, Id) values("${group.name}", ${id}, ${admin?1:0}, ${register?1:0}, ${group.id})`);    
                }
                try{await this.connection.query(`alter table eventList add column id${id} bool default 0`)}
                catch(e: any) {}
                try{await this.connection.query(`alter table dayList add column id${id} bool default 0`)}
                catch(e: any) {}
            }
            else if (group) {
                if (Boolean(userInGroup[0].register) !== register) {
                    await this.connection.query(`update GroupsList set register=${register?1:0} where Id=${group.id} and tgId=${id}`)
                }
                if (Boolean(userInGroup[0].admin) !== admin) {

                    await this.connection.query(`update GroupsList set admin=${admin?1:0} where Id=${group.id} and tgId=${id}`)
                }
            }
        } catch (e: any) {
            console.log(e)
        }
    }
    
    userSearch = async (data: DataForUserSearch, groupId: number) => {
        if (!data?.dataFields) data.dataFields = '*';
        try {
            let queryString: string = '';
            if (groupId){
                if (data?.id) queryString = `select ${data.dataFields} from GroupsList join UsersList on GroupsList.tgId=UsersList.id where GroupsList.Id=${groupId} and UsersList.id=${data.id}`
                else if (data?.register) queryString = `select ${data.dataFields} from GroupsList join UsersList on GroupsList.tgId=UsersList.id where GroupsList.Id=${groupId} and GroupsList.register=true`
                else if (data?.admin) queryString = `select ${data.dataFields} from GroupsList join UsersList on GroupsList.tgId=UsersList.id where GroupsList.Id=${groupId} and GroupsList.admin=true`
                else queryString = `select ${data.dataFields} from GroupsList join UsersList on GroupsList.tgId=UsersList.id where GroupsList.Id=${groupId}`
            }
            else queryString = `select * from UsersList`;
            let hist: any[] = await this.connection.query(queryString)
            if (!hist[0].length)
                return false
            else return hist[0]
        } catch (e: any) {
            console.log(e)
            return false
        }
    }
    
    userCheck = async (id: number, group?: number): Promise<boolean | TGCheck> => {
        try {
            let hist: any[] = [];
            if (group) hist = await this.connection.query(`select register, admin from GroupsList join UsersList on GroupsList.tgId=UsersList.id where GroupsList.tgId=${id} and GroupsList.Id=${group}`);
            else hist = await this.connection.query(`select * from UsersList where id=${id}`)
            if (!hist[0].length)
                return false
            else if (group) return hist[0][0] as TGCheck;
            else return true
        } catch (e: any) {
            console.log(e)
            return false
        } finally {
        }
    }

    
    delUser = async (id: number, groupId: number): Promise<boolean> => {
        try {
            await this.connection.query(`DELETE FROM GroupsList where tgId=${id} and Id=${groupId}`)
            const otherLists: {tgId: number}[] = (await this.connection.query(`select * from GroupsList where tgId=${id}`))[0] as {tgId: number}[]
            if (!otherLists.length) {
                await this.connection.query(`DELETE FROM UsersList where id=${id}`)
                await this.connection.query(`alter table eventList drop column id${id}`)
                await this.connection.query(`alter table dayList drop column id${id}`)
            }
            return true
        } catch (e: any) {
            console.log(e)
            return e?.errno === 1091 ? true : false
        }
    }
}