import { Model, Sequelize, BuildOptions } from "sequelize";
import { DataTypes } from 'sequelize';

export interface DaysAttributes {
  id: number,
  free: boolean,
  evtDate: string,
  dayPart: number,

}

export interface ActiveModel extends Model<DaysAttributes>, DaysAttributes {}

export type ActiveStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): ActiveModel;
};

export default function(sequelize: Sequelize) {
  return sequelize.define('dayList', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    free: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    evtDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    daypart: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    groupID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    id209103348: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    id214455979: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    id7682990265: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    id1308520456: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    tableName: 'dayList',
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
