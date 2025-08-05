import SEQabsClass from '@/mech/sqlFuncs/helpers/SEQabsClass';
import { Sequelize } from 'sequelize';
import { logger } from "@/winston/logger";
import { GroupsAttr } from "@/types/sql";

export class SQLgroupSEQ extends SEQabsClass {  //работа с табличками с группами
    model
    constructor (sequelize: Sequelize) {
        super(sequelize)
        this.model = this._init.initGroups()
    }
    async checkUser(id: number, groupId: number): Promise<boolean> { //проверка пользователя
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

    async set(id: number, name: string, register: boolean, admin: boolean, groupID?: number): Promise<boolean> { //создание группы
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

    async get(tgId: number, groupID?: number): Promise<false|GroupsAttr[]> { //получение группы
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

    async search(id: number): Promise<false|GroupsAttr[]> { //поиск группы
        try {
            return (await this.model.findAll({where: {Id: id}}))
        } catch (e) {
            logger.info('warn', e);
            return false
        }
    }

    //обновление пользователя
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
    async totalUser(groupID: number): Promise<number|false> {  //выдача списка пользователя группы
        try {
            return await this.model.count({where: {Id: groupID}})
        } catch (error) {
            logger.log('warn', error)
            return false
        }
    }
}