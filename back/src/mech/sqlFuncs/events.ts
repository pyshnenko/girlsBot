import SEQabsClass from '@/mech/sqlFuncs/helpers/SEQabsClass';
import { Sequelize, Model, fn, col, where, Op } from 'sequelize';
import { logger } from "@/winston/logger";
import sqlDataToEventArrFunc from '@/mech/sqlFuncs/helpers/sqlDataToEventArrFunc'

export class SQLeventsSEQ extends SEQabsClass {
    model
    daysModel
    constructor (sequelize: Sequelize) {
        super(sequelize)
        this.model = this._init.initEvent()
        this.daysModel = this._init.initEventAgr()
    }
    async add(authorID: number, namestring: string, dateevent: Date, place: string, linc: string, groupID: number): Promise<number|false> {
        try {
            await this.model.create({
                authorID, namestring, dateevent: dateevent.toISOString(), place, linc, groupID
            })
            return (await this.model.findAll({attributes: ['id'], where: {authorID, dateevent:dateevent.toISOString()}}))[0].id||false
        } catch (error) {
            logger.log('warn', error)
            return false
        }
    }
    async upd(id: number, namestring: string, dateevent: Date, place: string, linc: string, groupID: number): Promise<boolean> {
        try{
            await this.model.update({namestring, dateevent: dateevent.toISOString(), place, linc}, {
                where: {id, groupID}
            })
            return true
        } catch(e){
            logger.log('warn', e)
            return false
        }
    }
    async del(id: number, groupID: number): Promise<boolean> {
        try {
            await this.model.destroy({where: {id, groupID}})
            return true
        } catch (error) {
            logger.log('warn', error)
            return false
        }
    }
    async getEvent(groupID: number, from: Date, to?: Date): Promise<any[] | null> {
        try {
            const whereObj = to ? {
                dateevent: {[Op.between]: [from.toISOString(), to.toISOString()]},
                groupID
            } : {
                dateevent: {[Op.gte]: from.toISOString()},
                groupID
            }
            this.model.belongsTo(this.daysModel, {foreignKey: 'id'})
            this.daysModel.hasMany(this.model, {foreignKey: 'id'})
            const resultSQL = await this.model.findAll({
                include: [this.daysModel],
                order: ['dateevent'],
                where: whereObj,
                raw: true
            })
            
            return sqlDataToEventArrFunc(resultSQL)
        } catch (error) {
            logger.log('warn', error)
            return null
        }
    }
    async YNEvt (id: number, result: 1|2|null, tgId: number, group: number): Promise<boolean> {
        try {
            if ((await this.daysModel.findAll({raw: true, where: {
                id, tgId
            }})).length) await this.daysModel.update({res: result===1}, {where:{
                tgId, id
            }})
            else await this.daysModel.create({
                id, tgId, res: result===1
            })
            return true
        } catch (error) {
            logger.log('warn', error)
            return false
        }
    }
}