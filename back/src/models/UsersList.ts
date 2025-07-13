import { Sequelize, DataTypes, Model, BuildOptions } from "sequelize";
import { TGFrom } from "@/types/tgTypes";

export interface UsersModel extends Model<TGFrom>, TGFrom {}

export type UsersStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): UsersModel;
};

export default function(sequelize: Sequelize) {
  return <UsersStatic>sequelize.define('UsersList', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      primaryKey: true
    },
    isBot: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    first_name: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    last_name: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    username: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    language_code: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    is_premium: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    tableName: 'UsersList',
    timestamps: false
  });
};
