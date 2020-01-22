const sequelize = require('../config/postgres.config');
const Sequelize = require('sequelize');

module.exports = Twoot = sequelize.define('twoot', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false,
    field: 'id'
  },
  author_id: {
    type: Sequelize.STRING
  },
  content: {
    type: Sequelize.TEXT
  },
  createdAt: {
    type: Sequelize.DATE
  }
});
