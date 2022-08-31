'use strict';

const { sequelize } = require("../models");

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('spots', [{
      "ownerId": 1,
      "address": "aaa123 Didney Lane",
      "city": "Testville",
      "state": "Testnessee",
      "country": "United States of Testing",
      "lat": 37.7645358,
      "lng": -122.4730327,
      "name": "Test Academy",
      "description": "Place where Tests are created",
      "price": 1234
    },
    {
      "ownerId": 2,
      "address": "456 eggsample street",
      "city": "Eggville",
      "state": "Egg",
      "country": "United States of Egg",
      "lat": 37.7645358,
      "lng": -122.4730327,
      "name": "Test Academy",
      "description": "Place where Egg is created",
      "price": 331.9
    },
    {
      "ownerId": 4,
      "address": "456 eggsample street",
      "city": "Eggville",
      "state": "Egg",
      "country": "United States of Egg",
      "lat": 37.7645358,
      "lng": -122.4730327,
      "name": "Test Academy",
      "description": "Place where Egg is created",
      "price": 331.9
    }])
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete('Spots', {
      name: { [Op.in]: ['Test Academy'] }
    }, {});
  }
};
