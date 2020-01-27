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
    type: Sequelize.STRING
  },
  img_name: {
    type: Sequelize.TEXT
  },
  parent_twoot: {
    type: Sequelize.STRING
  },
  child_twoots: {
    type: Sequelize.STRING
  },
  hashtags: {
    type: Sequelize.ARRAY(Sequelize.STRING)
  },
  createdAt: {
    type: Sequelize.DATE
  }
});
