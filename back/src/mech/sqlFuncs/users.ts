import { Connection } from "mysql2/promise";
import { TGFrom, TGCheck, FullTGForm } from "@/types/tgTypes";
import { DataForUserSearch } from "@/types/tgTypes";
import SEQabsClass from '@/mech/sqlFuncs/helpers/SEQabsClass';
import { Sequelize, Model, fn, col } from 'sequelize';
import { logger } from "@/winston/logger";
import sql from '@/mech/sql'
import { GroupModel } from "@/models/GroupsList";

type UserOrNot<T> = T extends number ? Promise<false | TGCheck> : Promise<boolean>

export class SQLusersSEQ extends SEQabsClass {
    _model
    constructor (sequelize: Sequelize) {
        super(sequelize)
        this._model = this._init.initUsers()
    }

    async _checkUser(id: number): Promise<TGFrom|false> {
        const user: TGFrom[] = await this._model.findAll({where: {id}, raw: true})
        return user.length ? user[0] : false
    }

    async add(group: {id: number, name: string}|null, id: number, admin: boolean, register: boolean, tgData:TGFrom) {
        try {
            const isUser = await this._checkUser(id);
            if (!isUser) await this._model.create({
                    ...tgData
                })
            if (group) await sql.group.updateUser(id, group.id, admin,register,group.name)
        } catch(e){
            logger.log('warn', e)
        }
    }

    async search(data: DataForUserSearch, groupId: number) {
        if (!data?.dataFields) data.dataFields = '*';
        try {
            if (groupId) {
                sql.group.model.belongsTo(this._model, {foreignKey: 'tgId'})
                this._model.hasMany(sql.group.model, {foreignKey: 'id'})
                type WhereType = Omit<DataForUserSearch, 'id'|'dataFields'>|{Id?: number, tgId?: number};
                let whereObj: WhereType = {
                    Id: groupId
                }
                if (data?.register) whereObj = {...whereObj, register: data.register}
                if (data?.admin) whereObj = {...whereObj, admin: data.admin}
                if (data?.id) whereObj = {...whereObj, tgId: data.id}
                let hist: GroupModel|{[keys: string|symbol]: any}[] = await sql.group.model.findAll({raw: true, include: [this._model], where: {...whereObj}})
                //console.log(hist)
                let outArr: FullTGForm[] = hist.map((item: any) =>{
                    return {
                        id: item.tgId,
                        is_bot: item['UsersList.isBot']===1,
                        first_name: item['UsersList.first_name'],
                        last_name: item['UsersList.last_name'],
                        username: item['UsersList.username'],
                        language_code: item['UsersList.language_code'],
                        is_premium: item['UsersList.is_premium']===1,
                        name: item.name,
                        Id: item.Id,
                        register: item.register,
                        admin: item.admin
                    }
                })
                return hist.length ? outArr : []
            }
            return await this._model.findAll({raw: true}) || []
        } catch(e) {
            logger.log('warn', e)
            return []
        }
    }
    async check(id: number, groupF?: number): Promise<boolean | TGCheck> {
        try {
            const group: number = groupF ? groupF : await sql.activeTest.get(id)||0;
            return (await sql.group.model.findAll({
                raw: true,
                attributes: ['register', 'admin'],
                where: {
                    tgId: id,
                    Id: group
                }
            }))[0] || false
        } catch(e) {
            logger.log('warn', e)
            return false
        }
    }
    async del(id: number, groupId: number): Promise<boolean> {
        try {
            await sql.group.model.destroy({where: {tgId: id, Id: groupId}})
            if ((await sql.group.model.findAll({raw: true, where: {tgId: id}})).length===0)
                await this._model.destroy({where: {id}})
            return true
        } catch(e) {
            logger.log('warn', e)
            return false
        }
    }
}
/*
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
                try{await this.connection.query(`alter table eventList add column id${id} int default 0`)}
                catch(e: any) {}
                try{await this.connection.query(`alter table dayList add column id${id} int default 0`)}
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
}*/