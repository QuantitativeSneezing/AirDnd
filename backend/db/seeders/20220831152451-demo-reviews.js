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
        "review": "This was an awesome spot!",
        "stars": 5
      },
      {
        "userId": 2,
        "spotId": 1,
        "review": "This was an ok spot :/",
        "stars": 5
      }
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
