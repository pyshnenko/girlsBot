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
/*
export default class SQLEvents {
    connection: Connection;

    constructor (connection: Connection) {
        this.connection = connection;
    }

    addEvent = async (authorID: number, namestring: string, dateevent: Date, place: string, linc: string, group: number): Promise<number|false> => {
        try {
            await this.connection.query(`insert eventList(authorID, namestring, dateevent, place, linc, groupID) values(${authorID}, "${namestring}", "${dateToSql(dateevent)}", "${place}", "${linc}", ${group})`)
            return ((await this.connection.query(`select id from eventList where authorID=${authorID} and dateevent="${dateToSql(dateevent)}"`))[0] as {id: number}[])[0]?.id||false
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
                to ? `select * from eventList where dateevent>"${dateToSql(from)}" and dateevent<"${dateToSql(to)}" and groupID=${group} order by dateevent` : 
                `select * from eventList where dateevent>"${dateToSql(from)}" and groupID=${group}`)
            //console.log(ask)
            return (ask)[0] as eventListType[]
        } catch (e: any) {
            console.log('err')
            return null
        }
    }
}*/