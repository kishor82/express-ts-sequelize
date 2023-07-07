import { QueryInterface, Transaction, DataTypes } from 'sequelize';
import { DBTableName } from '../../constants';

export default {
  async up(queryInterface: QueryInterface) {
    let transaction: Transaction;

    try {
      transaction = await queryInterface.sequelize.transaction();
      await queryInterface.createTable(
        DBTableName.User,
        {
          id: {
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            type: DataTypes.UUID
          },
          roleId: {
            type: DataTypes.UUID,
            allowNull: false
          },
          firstName: {
            type: DataTypes.STRING,
            allowNull: false
          },
          lastName: {
            type: DataTypes.STRING,
            allowNull: false
          },
          userName: {
            type: DataTypes.STRING,
            unique: true,
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
        { transaction }
      );

      await transaction.commit();
    } catch (err) {
      if (transaction) await transaction.rollback();
      throw err;
    }
  },
  async down(queryInterface) {
    await queryInterface.dropTable(DBTableName.User);
  }
};
