const sequelize = require('../config/postgres.config');
const Sequelize = require('sequelize');
module.exports = Fav = sequelize.define('fav', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false,
    field: 'id'
  },
  user_id: {
    type: Sequelize.STRING
  },
  twoot_id: {
    type: Sequelize.STRING
  }
});
