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
    await queryInterface.bulkInsert('Spots', [{
      "ownerId": 2,
      "address": "15 Cyber Street",
      "city": "Cyber City",
      "state": "Cyber World",
      "country": "Dark World",
      "lat": 37.7645358,
      "lng": -122.4730327,
      "name": "Qu33n's Residence",
      "description": "Palace of the queen of cyber city",
      "price": 1337
    },
    {
      "ownerId": 2,
      "address": "The edge of the world",
      "city": "Desolate island",
      "state": "Southwest corner of the Unterzee",
      "country": "The Unterzee",
      "lat": 37.7645358,
      "lng": -122.4730327,
      "name": "Kingeater's castle",
      "description": "Lose your mind",
      "price": 0
    },
    {
      "ownerId": 3,
      "address": "10 Main Street",
      "city": "Innsmouth",
      "state": "Massachusetts",
      "country": "United States of America",
      "lat": 42.3601,
      "lng": 71.0589,
      "name": "Innsmouth Hotel",
      "description": "Fun for the whole family!",
      "price": 10
    },
    {
      "ownerId": 2,
      "address": "3-13 Jinbocho",
      "city": "Duelist City",
      "state": "Kanto",
      "country": "Japan",
      "lat": 35.6762,
      "lng": 139.6503,
      "name": "Kaiba's battle blimp",
      "description": "For playing children's card games in",
      "price": 1000000
    },
    {
      "ownerId": 2,
      "address": "Time Abyss",
      "city": "Beyond the known world",
      "state": "Mississipi",
      "country": "USA",
      "lat": 37.7645358,
      "lng": -122.4730327,
      "name": "Gaping hole in the fabric of spacetime",
      "description": "Business as usual",
      "price": 15
    },
    {
      "ownerId": 2,
      "address": "Mystery Flesh street",
      "city": "Outside of Austin",
      "state": "Texas",
      "country": "USA",
      "lat": 37.7645358,
      "lng": -122.4730327,
      "name": "Mystery flesh pit national park",
      "description": "Fun for the whole Family!",
      "price": 200
    },
    {
      "ownerId": 1,
      "address": "Slightly off center from reality",
      "city": "All cities",
      "state": "Every state",
      "country": "All countries",
      "lat": 37.7645358,
      "lng": -122.4730327,
      "name": "Backrooms",
      "description": "Smells kind of funny",
      "price": 0
    },

    {
      "ownerId": 4,
      "address": "12 Hammerhand Street",
      "city": "Helm's Deep",
      "state": "White mountains",
      "country": "England",
      "lat": 37.7645358,
      "lng": -122.4730327,
      "name": "Helm's deep inn",
      "description": "Free second breakfasts!",
      "price": 100
    },
    {
      "ownerId": 4,
      "address": "Middle of nowhere",
      "city": "Deep in the woods, and only at night",
      "state": "Overworld",
      "country": "Minecraft",
      "lat": 37.7645358,
      "lng": -122.4730327,
      "name": "Herobrine's mansion",
      "description": "Don't go in",
      "price": 9990913049
    },

    {
      "ownerId": 1,
      "address": "234 [REDACTED] Street",
      "city": "[REDACTED]",
      "state": "[DATA EXPUNGED]",
      "country": "USA",
      "lat": 37.7645358,
      "lng": -122.4730327,
      "name": "Site-19",
      "description": "Containment facility",
      "price": 1000000
    },
    {
      "ownerId": 2,
      "address": "3-14 Shinjuku",
      "city": "Tokyo",
      "state": "Kanto",
      "country": "Japan",
      "lat": 35.6762,
      "lng": 139.6503,
      "name": "Cover Corporation HQ",
      "description": "Burial place of Yagoo's Dream",
      "price": 1000000
    },
    ])
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete('Spots', {});
  }
};
