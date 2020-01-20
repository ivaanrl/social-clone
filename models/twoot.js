const sequelize = require('../config/postgres.config');
const Sequelize = require('sequelize');
const User = require('./user');
const Favs = require('./fav');

module.exports = Twoot = sequelize.define('twoot', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false,
    field: 'id'
  },
  authorId: {
    type: Sequelize.STRING
  },
  content: {
    type: Sequelize.TEXT
  },
  createdAt: {
    type: Sequelize.DATE
  }
});
