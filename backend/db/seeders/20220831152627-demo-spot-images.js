'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("SpotImages", [
      {
        spotId: 1,
        url: "https://static.wikia.nocookie.net/deltarune/images/6/6e/Cyber_Field_location.png",
        preview: true
      },

      {
        spotId: 2,
        url: 'https://static.wikia.nocookie.net/sunlesssea_gamepedia/images/2/28/SS_Kingeaters_Castle_Map.png',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://static.wikia.nocookie.net/yugioh/images/a/a6/Kaiba_Craft_3.jpg',
        preview: true
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
    await queryInterface.bulkDelete('SpotImages', {
      spotId: { [Op.in]: [1] }
    }, {});
  }
};
