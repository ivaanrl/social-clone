const uuid = require('uuid');
const sequelize = require('../config/postgres.config');
//const Follows = require('../models/follows');
const User = require('../models/user');

module.exports = app => {
  app.post('/api/followers/follow', async (req, res) => {
    try {
      console.log('Followinnnnnnnnnnnnnnnng');
      const usersIds = await sequelize.query(
        `INSERT INTO follows 
        VALUES ('${uuid()}',( SELECT id FROM users WHERE username='${
          req.body.follower
        }'), (SELECT id FROM users WHERE username='${req.body.following}'))`
      );
      res.json('Success!');
    } catch (error) {
      res.json(error);
    }
  });

  app.post('/api/followers/unfollow', async (req, res) => {
    try {
      const usersIds = await sequelize.query(
        `DELETE FROM follows 
        WHERE user_id= (
                        SELECT id FROM users WHERE username='${req.body.follower}'
                       ) AND
            follower_id = (
                          SELECT id FROM users WHERE username='${req.body.following}'
                          )`
      );
      console.log('akjbdaslkjdk');
      res.json('res');
    } catch (error) {
      res.json(error);
    }
  });
};
