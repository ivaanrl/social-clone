//const sequelize = require('../config/postgres.config');

module.exports = app => {
  app.get('/api/explore/:hashtag/:page', async (req, res) => {
    try {
      const hashtag = req.params.hashtag;
      const twoots = await sequelize.query(`
        SELECT first_name, last_name, content, twoots."createdAt",
          username, twoots.id AS twoot_id, users.id AS user_id, img_name,
          users.profile_pic_name AS profile_img_name 
        FROM twoots
        INNER JOIN users On users.id = twoots.author_id
        WHERE '${hashtag}' = ANY(hashtags)
        LIMIT 15 
        OFFSET ${parseInt(req.params.page, 10)}*15
      `);

      res.json(twoots[0]);
    } catch (error) {
      res.json(error);
    }
  });

  app.get('/api/explore/search/:search_content/:page', async (req, res) => {
    try {
      const searchContent = req.params.search_content;
      const twoots = await sequelize.query(`
        SELECT first_name, last_name, content, twoots."createdAt",
          username, twoots.id AS twoot_id, users.id AS user_id, img_name,
          users.profile_pic_name AS profile_img_name 
        FROM twoots
        INNER JOIN users On users.id = twoots.author_id
        WHERE username LIKE '%${searchContent}%' OR '${searchContent}' = ANY(hashtags)
        LIMIT 15 
        OFFSET ${parseInt(req.params.page, 10)}*15
      `);

      res.json(twoots[0]);
    } catch (error) {
      res.json(error);
    }
  });

  app.get('/api/explore/mostUsedHashtags', async (req, res) => {
    try {
      const hashtags = await sequelize.query(`
        SELECT hashtag, COUNT(*) as hashtag_times
        FROM twoots, unnest(hashtags) as hashtag
        WHERE NOT '' = ANY(hashtags)
        GROUP BY hashtag
        ORDER BY COUNT(*) DESC
        LIMIT 7
      `);

      res.json(hashtags[0]);
    } catch (error) {
      res.json(error);
    }
  });
};
