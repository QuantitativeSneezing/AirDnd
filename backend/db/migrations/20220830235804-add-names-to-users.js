'use strict';

const { sequelize } = require("../models");

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await [
      queryInterface.addColumn ("Users", "firstName", Sequelize.STRING  ),
      queryInterface.addColumn("Users", "lastName", Sequelize.STRING )
    ]
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    // auto drop tables anyway lol
  }
};
