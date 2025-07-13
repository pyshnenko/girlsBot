import { Connection } from "mysql2/promise";
import { groupSearchResult } from "@/types/sql";
import SEQabsClass from '@/mech/sqlFuncs/helpers/SEQabsClass';
import { Sequelize, Model, fn, col } from 'sequelize';
import { logger } from "@/winston/logger";
import { GroupsAttr } from "@/types/sql";

export class SQLgroupSEQ extends SEQabsClass {
    model
    constructor (sequelize: Sequelize) {
        super(sequelize)
        this.model = this._init.initGroups()
    }
    async checkUser(id: number, groupId: number): Promise<boolean> {
        return (await this.model.findAll({
            raw: true, 
            attributes: {exclude: ['id']}, 
            where: {
                Id: groupId,
                tgId: id
            }
        })).length ? true : false
    }
    async _maxID(): Promise<number> {
        const data = await this.model.findAll({
            raw: true
        })
        const idList: number[] = data.map((item: GroupsAttr)=>item.Id)
        return Math.max(...idList)
    }
    async set(id: number, name: string, register: boolean, admin: boolean, groupID?: number): Promise<boolean> {
        try {
            const newId = groupID || await this._maxID();
            await this.model.create({
                tgId: id,
                Id: newId,
                name,
                admin: admin?1:0,
                register: register?1:0
            })
            return true
        } catch(e) {
            logger.log('warn', e)
            return false
        }
    }
    async get(tgId: number, groupID?: number): Promise<false|GroupsAttr[]> {
        try {
            return await this.model.findAll({
                raw: true, 
                where: !(groupID) ? 
                    {register: true, tgId} :
                    {tgId, Id: groupID}
            })
        } catch(e) {
            logger.log('warn', e)
            return false
        }
    }
    async search(id: number): Promise<false|GroupsAttr[]> {
        try {
            return (await this.model.findAll({where: {Id: id}}))
        } catch (e) {
            logger.info('warn', e);
            return false
        }
    }
    async updateUser(id: number, groupId: number, admin: boolean, register: boolean, name: string): Promise<boolean> {
        try {
            const check = await this.get(id, groupId)
            if (check) await this.model.update({
                admin: admin?1:0, 
                register: register?1:0
            }, {where: {
                Id: groupId,
                tgId: id
            }})
            else await this.model.create({
                admin: admin?1:0,
                register: register?1:0,
                Id: groupId,
                tgId: id,
                name
            })
            return true
        } catch(e) {
            logger.log('warn', e)
            return false
        }
    }
    async totalUser(groupID: number): Promise<number|false> {
        try {
            return await this.model.count({where: {Id: groupID}})
        } catch (error) {
            logger.log('warn', error)
            return false
        }
    }
}
/*
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
}*/