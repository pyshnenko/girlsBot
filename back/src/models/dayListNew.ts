import { Model, Sequelize, BuildOptions } from "sequelize";
import { DataTypes } from 'sequelize';
import { DaysAttributes } from "@/types/sql";

export interface ActiveModel extends Model<DaysAttributes>, DaysAttributes {}

export type ActiveStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): ActiveModel;
};
export default function(sequelize: Sequelize) {
  return <ActiveStatic>sequelize.define('dayListNew', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    evtDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    tgId: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    free: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    tableName: 'dayListNew',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
