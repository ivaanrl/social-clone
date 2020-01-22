const sequelize = require('../config/postgres.config');
const Sequelize = require('sequelize');

module.exports = Follows = sequelize.define('follows', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false,
    field: 'id'
  },
  user_id: {
    type: Sequelize.STRING
  },
  follower_id: {
    type: Sequelize.STRING
  },
  createdAt: {
    type: Sequelize.DATE
  }
});
