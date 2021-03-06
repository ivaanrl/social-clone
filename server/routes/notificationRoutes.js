//const sequelize = require('../config/postgres.config');
const uuid = require('uuid');
module.exports = app => {
  app.post('/api/notifications/sendNotification', async (req, res) => {
    try {
      await sequelize.query(
        `INSERT INTO notifications (id,user_id,content,"createDate")
          VALUES ('${uuid()}',(SELECT id FROM users WHERE username='${
          req.body.receiver_username
        }'),
                  ' ${req.body.message}', '${Date.now()}'
                  )`
      );

      res.json('');
    } catch (error) {
      res.json(error);
    }
  });

  app.post('/api/notifications/getNotifications', async (req, res) => {
    try {
      const notifications = await sequelize.query(
        `SELECT * FROM notifications WHERE user_id= (SELECT id FROM users WHERE username='${req.body.username}') ORDER BY "createDate" DESC`
      );

      res.json(notifications[0]);
    } catch (error) {
      res.json(error);
    }
  });
};
