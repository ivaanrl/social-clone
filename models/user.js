const sequelize = require('../config/postgres.config');
const Sequelize = require('sequelize');
const Twoot = require('./twoot');
const Favs = require('./fav');
const Follows = require('./follows');

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
  created_at: {
    type: Sequelize.DATE
  },
  updated_at: {
    type: Sequelize.DATE
  },
  modified: {
    type: Sequelize.BOOLEAN
  },
  last_login: {
    type: Sequelize.DATE
  }
});
User.hasMany(Twoot, { foreignKey: 'author_id' });
User.hasMany(Favs, { foreignKey: 'user_id' });
Twoot.belongsTo(User, { foreignKey: 'author_id' });
Twoot.hasMany(Favs, { foreignKey: 'twoot_id' });
Fav.belongsTo(User, { foreignKey: 'user_id' });
Fav.belongsTo(Twoot, { foreignKey: 'twoot_id' });
User.hasMany(Follows, { as: 'Followers', foreignKey: 'follower_id' });
User.hasMany(Follows, { as: 'Following', foreignKey: 'user_id' });
