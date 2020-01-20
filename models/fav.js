const sequelize = require('../config/postgres.config');
const Sequelize = require('sequelize');
const User = require('./user');
const Twoot = require('./twoot');
module.exports = Fav = sequelize.define('fav', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false,
    field: 'id'
  },
  userId: {
    type: Sequelize.STRING
  },
  twootId: {
    type: Sequelize.STRING
  }
});
