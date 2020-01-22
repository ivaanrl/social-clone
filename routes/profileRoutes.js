const uuid = require('uuid');
const sequelize = require('../config/postgres.config');

module.exports = app => {
  app.post('/api/profile/basicInfo', async (req, res) => {
    try {
      console.log('lel');
      const profileInfo = await sequelize.query(
        `SELECT first_name,last_name,email,about, users."createdAt", COUNT(*) as twoot_count 
         FROM users 
         INNER JOIN twoots 
          ON twoots.author_id = users.id 
         WHERE username='${req.body.username}' 
         GROUP BY first_name,last_name,email,about, users."createdAt"`
      );
      res.json(profileInfo[0][0]);
    } catch (error) {
      res.json(error);
    }
  });
};
