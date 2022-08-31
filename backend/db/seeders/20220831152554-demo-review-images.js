'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("ReviewImages", [
      {
        reviewId: 1,
        url: "www.google.com"
      },
      {
        reviewId:1,
        url :"www.bing.com"
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
     await queryInterface.bulkDelete('ReviewImages', {
       reviewId: { [Op.in]: [1] }
     }, {});
  }
};
