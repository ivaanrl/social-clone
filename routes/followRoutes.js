const uuid = require('uuid');
const sequelize = require('../config/postgres.config');
//const Follows = require('../models/follows');

module.exports = app => {
  app.post('/api/followers/follow', async (req, res) => {
    try {
      console.log('Followinnnnnnnnnnnnnnnng');
      const usersIds = await sequelize.query(
        `SELECT id FROM users WHERE username='${req.body.follower}' OR username='${req.body.following}'`
      );
      console.log('Followinnnnnnnnnnnnnnnng');
      const id = uuid();
      const [user_id, follower_id] = usersIds[0];
      console.log(user_id);
      const createFollow = await sequelize.query(
        `INSERT INTO follows (id,user_id,follower_id)
         VALUES ${id}, ${user_id.id}, ${follower_id.id}
        `
      );
      res.json(createFollow);
    } catch (error) {
      res.json(error);
    }
  });

  app.post('/api/followers/unfollow', async (req, res) => {
    try {
      const usersIds = await sequelize.query(
        `SELECT id FROM users WHERE username='${req.body.follower}' OR username='${req.body.following}'`
      );
      const [user_id, follower_id] = usersIds[0];
      const destroyFollow = await Follows.destroy({
        where: {
          user_id,
          follower_id
        }
      });
      console.log(destroyFollow);
      res.json(req.body);
    } catch (error) {
      res.json(error);
    }
  });
};
