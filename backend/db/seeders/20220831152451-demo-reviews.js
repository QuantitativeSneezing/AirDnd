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
