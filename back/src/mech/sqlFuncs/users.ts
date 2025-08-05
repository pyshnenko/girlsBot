import { TGFrom, TGCheck, FullTGForm } from "@/types/tgTypes";
import { DataForUserSearch } from "@/types/tgTypes";
import SEQabsClass from '@/mech/sqlFuncs/helpers/SEQabsClass';
import { Sequelize } from 'sequelize';
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