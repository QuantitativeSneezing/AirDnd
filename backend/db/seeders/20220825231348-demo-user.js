'use strict';
const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        firstName: "Demo",
        lastName: "McDemo",
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: "SANS",
        lastName: "DELTARUNE",
        email: 'sans@user.io',
        username: 'SANS',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: "Ash",
        lastName: "Ketchum",
        email: 'ash.ketchum@gmail.com',
        username: 'ashketchum',
        hashedPassword: bcrypt.hashSync('pokemon')
      },
      {
        firstName: "Rick",
        lastName: "Sanchez",
        email: 'user@gmail.com',
        username: 'PickleRick',
        hashedPassword: bcrypt.hashSync('superFunny')
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Users', {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'ashketchum'] }
    }, {});
  }
};
