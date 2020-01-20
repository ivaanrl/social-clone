const sequelize = require('../config/postgres.config');
const Sequelize = require('sequelize');
const Twoot = require('./twoot');
const Favs = require('./fav');

module.exports = User = sequelize.define('user', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false,
    field: 'id'
  },
  first_name: {
    type: Sequelize.TEXT
  },
  last_name: {
    type: Sequelize.TEXT
  },
  email: {
    type: Sequelize.TEXT
  },
  username: {
    type: Sequelize.TEXT
  },
  password: {
    type: Sequelize.TEXT
  },
  about: {
    type: Sequelize.TEXT
  },
  location: {
    type: Sequelize.STRING
  },
  createdAt: {
    type: Sequelize.DATE
  },
  updatedAt: {
    type: Sequelize.DATE
  },
  modified: {
    type: Sequelize.BOOLEAN
  },
  last_login: {
    type: Sequelize.DATE
  }
});
User.hasMany(Twoot, { foreignKey: 'authorId' });
User.hasMany(Favs, { foreignKey: 'userId' });
Twoot.belongsTo(User, { foreignKey: 'authorId' });
Twoot.hasMany(Favs, { foreignKey: 'twootId' });
Fav.belongsTo(User, { foreignKey: 'userId' });
Fav.belongsTo(Twoot, { foreignKey: 'twootId' });
