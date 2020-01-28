const sequelize = require('../config/postgres.config');

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
};
