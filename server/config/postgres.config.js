const Sequelize = require('sequelize');
module.exports = sequelize = new Sequelize({
  database: 'twotter',
  username: 'ivan',
  password: '73442332',
  dialect: 'postgres',
  logging: false
});
