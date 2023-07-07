import { DataTypes, Model, ModelStatic, Optional, Sequelize } from 'sequelize';
import { Maybe } from '../../common';
import { DBTableName } from '../../constants';

export type User = {
  id: string;
  roleId: string;
  firstName: string;
  userName: string;
  lastName: string;
  password: string;
  status: number;
  email: string;
  phoneNumber?: number;
  companyName?: Maybe<string>;
  photo?: Maybe<string>;
  verficationToken?: Maybe<string>;
  passwordResetToken?: Maybe<string>;
  createdAt: Date;
  updatedAt: Date;
};

export type DBUser = User;
export type DBUserCreationAttributes = Optional<DBUser, 'id'>;
export type DBUserInstance = Model<DBUser, DBUserCreationAttributes>;

export const UserTable = (sequelize: Sequelize): ModelStatic<DBUserInstance> => {
  const user = sequelize.define<DBUserInstance>(
    DBTableName.User,
    {
      id: {
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID
      },
      roleId: {
        type: DataTypes.UUIDV4,
        allowNull: false
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: 1
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      phoneNumber: {
        type: DataTypes.BIGINT
      },
      companyName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      photo: {
        type: DataTypes.STRING,
        allowNull: true
      },
      verficationToken: {
        type: DataTypes.STRING,
        allowNull: true
      },
      passwordResetToken: {
        type: DataTypes.STRING,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    },
    {
      freezeTableName: true,
      timestamps: true
    }
  );
  return user;
};
