import { Sequelize, Model } from "sequelize"
import SQLinitModels from "@/models/init-models";

export default abstract class SEQabsClass {
    _sequelize
    _init
    constructor (sequelize: Sequelize) {
        this._sequelize = sequelize;
        this._init = new SQLinitModels(this._sequelize);
    }
}