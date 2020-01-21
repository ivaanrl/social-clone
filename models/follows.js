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
  follow_id: {
    type: Sequelize.STRING
  },
  created_at: {
    type: Sequelize.DATE
  }
});
