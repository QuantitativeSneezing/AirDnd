'use strict';

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
    await queryInterface.bulkInsert("Reviews", [
      {
        "userId": 1,
        "spotId": 1,
        "review": "Love the butlers!",
        "stars": 5
      },
      {
        "userId": 2,
        "spotId": 1,
        "review": "Hate the rats!",
        "stars": 1
      },
      {
        "userId": 3,
        "spotId": 1,
        "review": "I fell in a pool of acid :( Otherwise great though",
        "stars": 4
      },
      {
        "userId": 1,
        "spotId": 2,
        "review": "Not a nice place",
        "stars": 1
      },
      {
        "userId": 2,
        "spotId": 2,
        "review": "Makes me hungry",
        "stars": 2
      },
      {
        "userId": 3,
        "spotId": 2,
        "review": "Like the music!",
        "stars": 4
      },
      {
        "userId": 3,
        "spotId": 3,
        "review": "Gross!",
        "stars": 2
      },
      {
        "userId": 4,
        "spotId": 3,
        "review": "Lame!",
        "stars": 1
      },
      {
        "userId": 3,
        "spotId": 4,
        "review": "Cool!",
        "stars": 5
      },
      {
        "userId": 4,
        "spotId": 4,
        "review": "Awesome!",
        "stars": 5
      },
      {
        "userId": 3,
        "spotId": 5,
        "review": "meh",
        "stars": 3
      },
      {
        "userId": 4,
        "spotId": 5,
        "review": "Was decent",
        "stars": 4
      },
      {
        "userId": 3,
        "spotId": 6,
        "review": "Hated it",
        "stars": 1
      },
      {
        "userId": 4,
        "spotId": 6,
        "review": "LOVED IT!!!!!",
        "stars": 5
      },
      {
        "userId": 3,
        "spotId": 11,
        "review": "WEEB TIME",
        "stars": 5
      },
      {
        "userId": 4,
        "spotId": 11,
        "review": "I sure do love some Vtubers",
        "stars": 5
      },
      {
        "userId": 1,
        "spotId": 11,
        "review": "They fed me a tarantula, it was tasty",
        "stars": 5
      },
      {
        "userId": 3,
        "spotId": 7,
        "review": "Kinda loud",
        "stars": 2
      },
      {
        "userId": 4,
        "spotId": 7,
        "review": "I've seen better",
        "stars": 3
      },
      {
        "userId": 1,
        "spotId": 7,
        "review": "It was ok...",
        "stars": 2
      },
      {
        "userId": 3,
        "spotId": 9,
        "review": "Diggy diggy hole",
        "stars": 4
      },
      {
        "userId": 4,
        "spotId": 9,
        "review": "I like minecraft but this was a bit much",
        "stars": 3
      },
      {
        "userId": 1,
        "spotId": 9,
        "review": "Ow",
        "stars": 1
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
    await queryInterface.bulkDelete('Reviews', {
      userId: { [Op.in]: [1] }
    }, {});
  }
};
