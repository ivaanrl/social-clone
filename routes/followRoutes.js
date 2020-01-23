const uuid = require('uuid');
const sequelize = require('../config/postgres.config');

module.exports = app => {
  app.post('/api/followers/follow', async (req, res) => {
    try {
      console.log('Followinnnnnnnnnnnnnnnng');
      await sequelize.query(
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
      await sequelize.query(
        `DELETE FROM follows 
        WHERE user_id= (
                        SELECT id FROM users WHERE username='${req.body.follower}'
                       ) AND
            follower_id = (
                          SELECT id FROM users WHERE username='${req.body.following}'
                          )`
      );
      res.json('Success!');
    } catch (error) {
      res.json(error);
    }
  });

  app.post('/api/followers/check', async (req, res) => {
    try {
      const followCheck = await sequelize.query(
        `SELECT "id" 
        FROM "follows" AS "follows"
        WHERE "follows"."user_id" = (SELECT id FROM users WHERE username='${req.body.follower}')
        AND 
        "follows"."follower_id" = (SELECT id FROM users WHERE username='${req.body.following}') LIMIT 1;`
      );
      if (followCheck[1].rowCount === 1) {
        res.json(true);
      } else {
        res.json(false);
      }
    } catch (error) {
      res.json(error);
    }
  });
};
