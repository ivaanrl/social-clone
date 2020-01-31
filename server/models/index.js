if (!global.hasOwnProperty('db')) {
  const Sequelize = require('sequelize');
  sequelize = null;

  if (process.env.DATABASE_URL) {
    console.log('DATABASE URL:');
    console.log(process.env.DATABASE_URL);
    try {
      sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres',
        logging: true, //false,
        dialectOptions: {
          ssl: true
        }
      });
    } catch (error) {
      console.log("can't connect to DB!");
    }
  } else {
    sequelize = new Sequelize({
      database: 'twotter',
      username: 'ivan',
      password: '73442332',
      dialect: 'postgres',
      logging: true
    });
  }

  global.db = {
    Sequelize: Sequelize,
    sequelize: sequelize,
    User: sequelize.import(__dirname + '/user'),
    Fav: sequelize.import(__dirname + '/fav'),
    Follow: sequelize.import(__dirname + '/follow'),
    Notifications: sequelize.import(__dirname + '/notifications'),
    Twoot: sequelize.import(__dirname + '/twoot')
  };

  global.db.User.hasMany(global.db.Twoot, { foreignKey: 'author_id' });
  global.db.User.hasMany(global.db.Fav, { foreignKey: 'user_id' });
  global.db.Twoot.belongsTo(global.db.User, { foreignKey: 'author_id' });
  global.db.Twoot.hasMany(global.db.Fav, { foreignKey: 'twoot_id' });
  global.db.Fav.belongsTo(global.db.User, { foreignKey: 'user_id' });
  global.db.Fav.belongsTo(global.db.Twoot, { foreignKey: 'twoot_id' });
  global.db.User.hasMany(global.db.Follow, {
    as: 'Followers',
    foreignKey: 'follower_id'
  });
  global.db.User.hasMany(global.db.Follow, {
    as: 'Following',
    foreignKey: 'user_id'
  });
  global.db.User.hasMany(global.db.Notifications, { foreignKey: 'user_id' });
  global.db.Twoot.belongsTo(global.db.Twoot, { foreignKey: 'parent_twoot' });
  //global.db.User.hasMany(global.db.Message, {
  //  as: 'Sent_messages',
  //  foreignKey: 'from_id'
  //});
  //global.db.User.hasMany(global.db.Messages, {
  //  as: 'Received_messages',
  //  foreignKey: 'to_id'
  //});
}

module.exports = global.db;
