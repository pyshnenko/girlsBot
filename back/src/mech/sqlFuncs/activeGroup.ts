import * as dotenv from 'dotenv';
dotenv.config();
import { Connection } from "mysql2/promise";
import SQLinitModels from '@/models/init-models';
import { Sequelize, Model } from 'sequelize';
import SEQabsClass from '@/mech/sqlFuncs/helpers/SEQabsClass';
import sql from '@/mech/sql';
import { logger } from '@/winston/logger';

export class SQLActiveDateSEQ extends SEQabsClass {
    model
    constructor (sequelize: Sequelize) {
        super(sequelize)
        this.model = this._init.initActive()
    }
    async get(id: number): Promise<number|null> {
        console.log(id)
        const aData = await this.model.findAll({
            raw: true, 
            attributes: {exclude: ['id']}, 
            where: {tgId: id},
        })
        if (aData.length === 0) return null
        const checkUser = await sql.group.checkUser(id, aData[0].groupId)
        return checkUser ? aData[0].groupId : null
    }
    async set(id: number, res: number): Promise<boolean> {
        try {
            const checkUser = await sql.group.checkUser(id, res)
            if (!checkUser) return false
            const active: number|null = await this.get(id)
            console.log(active)
            if (active !== null) await this.model.update({
                groupId: res
            }, {
                where: {
                    tgId: id
                }
            })
            else await this.model.create({
                tgId: id,
                groupId: res
            })
            return true
        } catch(e){
            logger.log('warn', e)
            return false
        }
    }
}