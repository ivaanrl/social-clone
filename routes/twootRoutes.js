const User = require('../models/user');
const Twoot = require('../models/twoot');
const uuid = require('uuid');
const sequelize = require('../config/postgres.config');
const Sequelize = require('sequelize');

module.exports = app => {
  app.post('/api/twoot', (req, res) => {
    const id = uuid(); //CHECK CURRENT USER BETTER
    console.log(req.body);
    try {
      Twoot.create({
        id: id,
        authorId: req.session.user,
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
        'SELECT first_name, last_name, twoots.created_at, username FROM twoots INNER JOIN users ON twoots.author_id = users.id '
      );
      console.log(twoots);
      res.json(twoots);
    } catch (error) {
      res.json(error);
    }
  });
};
