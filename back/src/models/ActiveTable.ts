import { Model, Sequelize, BuildOptions, DataTypes } from "sequelize";
import { ActiveAttributes } from "@/types/sql";

export interface ActiveModel extends Model<ActiveAttributes>, ActiveAttributes {}

export type ActiveStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): ActiveModel;
};

export default function (sequelize: Sequelize) {
  return <ActiveStatic>sequelize.define('ActiveTable', {
    tgId: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'ActiveTable',
    timestamps: false
  });
};
