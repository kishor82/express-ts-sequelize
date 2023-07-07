import { QueryInterface, Transaction } from 'sequelize';
import { DBTableName } from '../../constants';

export default {
  up: async (queryInterface: QueryInterface) => {
    let transaction: Transaction;

    try {
      transaction = await queryInterface.sequelize.transaction();
      await queryInterface.bulkInsert(
        DBTableName.User,
        [
          {
            id: '6b1e578e-a62f-4c9c-88d4-c073e542e933',
            roleId: '4e942c65-27a5-4253-b59b-c2c8821d9f65',
            firstName: 'John',
            userName: 'john123',
            lastName: 'Doe',
            password: 'password123',
            status: 1,
            email: 'john@example.com',
            phoneNumber: 1234567890,
            companyName: 'Example Company',
            photo: 'user1.jpg',
            verficationToken: null,
            passwordResetToken: null,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 'fc8ffe94-ff11-4c80-b1bc-f715492f0ca6',
            roleId: '10128025-b8b8-4cea-ab85-49e3023ba917',
            firstName: 'Jane',
            userName: 'jane456',
            lastName: 'Smith',
            password: 'password456',
            status: 1,
            email: 'jane@example.com',
            phoneNumber: 9876543210,
            companyName: null,
            photo: null,
            verficationToken: null,
            passwordResetToken: null,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ],
        { transaction }
      );

      await transaction.commit();
    } catch (err) {
      if (transaction) await transaction.rollback();
      throw err;
    }
  },
  down: async (queryInterface) => {
    let transaction: Transaction;

    try {
      transaction = await queryInterface.sequelize.transaction();
      await queryInterface.bulkDelete(DBTableName.User, null, { transaction });
      await transaction.commit();
    } catch (err) {
      if (transaction) await transaction.rollback();
      throw err;
    }
  }
};
