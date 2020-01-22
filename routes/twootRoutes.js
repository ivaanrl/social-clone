const Twoot = require('../models/twoot');
const uuid = require('uuid');
const sequelize = require('../config/postgres.config');

module.exports = app => {
  app.post('/api/twoot', (req, res) => {
    const id = uuid(); //CHECK CURRENT USER BETTER
    console.log(req.body);
    try {
      console.log(req.session.user);
      Twoot.create({
        id: id,
        author_id: req.session.user,
        content: req.body.content
      });
    } catch (error) {
      res.json(error);
    }
    res.json(req.session);
  });

  app.get('/api/twoot', async (req, res) => {
    try {
      const twoots = await sequelize.query(
        'SELECT first_name, last_name, content, twoots."createdAt", username FROM twoots INNER JOIN users ON twoots.author_id = users.id ORDER BY twoots."createdAt" DESC '
      );

      res.json(twoots[0]);
    } catch (error) {
      res.json(error);
    }
  });

  app.post('/api/userTwoots', async (req, res) => {
    try {
      const userTwoots = await sequelize.query(
        `SELECT first_name, last_name, content, twoots."createdAt", username FROM twoots INNER JOIN users on twoots.author_id = users.id WHERE username='${req.body.username}' ORDER BY twoots."createdAt" DESC`
      );
      res.json(userTwoots[0]);
    } catch (error) {
      res.json(error);
    }
  });
};
