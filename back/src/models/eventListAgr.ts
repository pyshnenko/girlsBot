import { Sequelize, DataTypes, Model, BuildOptions } from "sequelize";
import { EventArgAttr } from "@/types/sql";

export interface EventArgModel extends Model<EventArgAttr>, EventArgAttr {}

export type EventArgStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): EventArgModel;
};

export default function(sequelize: Sequelize) {
  return <EventArgStatic>sequelize.define('eventListAgr', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    tgId: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    res: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    tableName: 'eventListAgr',
    timestamps: false
  });
};
