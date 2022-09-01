'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("SpotImages", [
      {
        spotId: 1,
        url: "www.goggle.com",
        preview: 1
      },
      {
        spotId:1,
        url :"www.boing.com",
        preview: 1
      }

    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     const Op = Sequelize.Op;
     await queryInterface.bulkDelete('SpotImages', {
       spotId: { [Op.in]: [1] }
     }, {});
  }
};
