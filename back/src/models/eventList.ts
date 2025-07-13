import { Sequelize, DataTypes, Model, BuildOptions } from "sequelize";
import { EventAttr } from "@/types/sql";

export interface EventModel extends Model<EventAttr>, EventAttr {}

export type EventStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): EventModel;
};

export default function(sequelize: Sequelize) {
  return <EventStatic>sequelize.define('eventList', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    authorID: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    namestring: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    dateevent: {
      type: DataTypes.DATE,
      allowNull: true
    },
    place: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    linc: {
      type: DataTypes.STRING(250),
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
    groupID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    id7682990265: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    id1308520456: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    tableName: 'eventList',
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
