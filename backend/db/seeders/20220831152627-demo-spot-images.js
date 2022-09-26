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
      },
      {
        spotId: 5,
        url: 'https://images.newscientist.com/wp-content/uploads/2019/04/08111018/screenshot-2019-04-08-10.24.34.jpg',
        preview: true
      },
      {
        spotId: 6,
        url: 'https://64.media.tumblr.com/20d7010687abb40c1cbcfb8fbe41b28b/4cd445db4e9237b8-e5/s1280x1920/5101678ef3a9f5442d90d9bcf706d536e9744e15.jpg',
        preview: true
      },

      {
        spotId: 7,
        url: 'https://static.wikia.nocookie.net/backrooms/images/0/05/Thebackrooms.jpg',
        preview: true
      },
      {
        spotId: 10,
        url: 'https://static.wikia.nocookie.net/scp-db/images/6/6c/Site-19.png',
        preview: true
      },
      {
        spotId: 8,
        url:  'https://static.wikia.nocookie.net/lotr/images/d/d3/Helm%27s_Deep_-_TtT.png',
        preview: true
      },
      {
        spotId: 9,
        url:  'https://static.wikia.nocookie.net/minecraft_gamepedia/images/5/5d/Woodland_Mansion.png',
        preview: true
      },
      {
        spotId: 11,
        url:  'https://upload.wikimedia.org/wikipedia/commons/b/b2/Cover_Corp_horizontal_logo_1.png',
        preview: true
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
    await queryInterface.bulkDelete('SpotImages', {
      spotId: { [Op.in]: [1] }
    }, {});
  }
};
