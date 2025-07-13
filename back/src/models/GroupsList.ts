import { Sequelize, DataTypes, Model, BuildOptions } from "sequelize";
import { GroupsAttr } from "@/types/sql";

export interface GroupModel extends Model<GroupsAttr>, GroupsAttr {}

export type GroupStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): GroupModel;
};

export default function(sequelize: Sequelize) {
  return <GroupStatic>sequelize.define('GroupsList', {
    name: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    tgId: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    admin: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    register: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    Id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    }
  }, {
    tableName: 'GroupsList',
    timestamps: false
  });
};
