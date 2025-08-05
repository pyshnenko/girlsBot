import SEQabsClass from "./helpers/SEQabsClass";
import { Sequelize, Op } from "sequelize";
import {logger} from '@/winston/logger';
import { WhereOptions } from "sequelize";
import { DaysAttributes } from "@/models/dayList";
import sqdDataToCalendar from "./helpers/sqlDataToCalendar";

export class SQLdateListSEQ extends SEQabsClass {
    model
    constructor (sequelize: Sequelize) {
        super(sequelize)
        this.model = this._init.initDayListNew()
    }

    //создание параметра where для seq
    _whereGeneration(date: Date, dateTo?: Date, tgId?: number): WhereOptions<DaysAttributes>|{tgId: number} {
        
        let whereObj: ReturnType<typeof this._whereGeneration> = {}
        
        if (dateTo) {whereObj={
            evtDate: {
                [Op.gte]: date.toISOString(),
                [Op.lte]: dateTo.toISOString()
            }
        }} else {whereObj={evtDate: date.toISOString()}}
        
        if (tgId) whereObj={...whereObj, tgId}
        
        return whereObj
    }

    //запрос календаря
    async get(groupId: number|null, date: Date, dateTo?: Date, tgId?: number) {
        try {
            if (!groupId) return []
            
            const aData = await this.model.findAll({
                raw: true, 
                where: {...this._whereGeneration(date, dateTo, tgId), groupId}
            })
            
            return sqdDataToCalendar(aData)
        } catch(e) {logger.log('warning', e); return []}
    }

    //запись в календарь
    async set(evtDate: Date[], tgId: number, res: boolean, groupID: number) {
        try {
            evtDate.forEach(async (date:Date)=> {
                const checkData = await this.get(groupID, date, undefined, tgId);
                if (checkData.length>0) {
                    await this.model.update({
                        free: res
                    }, {
                        where: {
                            tgId,
                            evtDate: date.toISOString(),
                            groupId: groupID
                        }
                    })
                    return true
                }
                else {
                    await this.model.create({
                        evtDate: date.toISOString(),
                        tgId: tgId,
                        free: res,
                        groupId: groupID
                    })
                    return true
                }
            })
        }
        catch(e) {logger.log('warning', e); return false}
    }
}