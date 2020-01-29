const sequelize = require('../config/postgres.config');
const Sequelize = require('sequelize');

module.exports = Notification = sequelize.define('notifications', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false,
    field: 'id'
  },
  user_id: {
    type: Sequelize.STRING
  },
  content: {
    type: Sequelize.TEXT
  },
  createdAt: {
    type: Sequelize.DATE
  }
});
