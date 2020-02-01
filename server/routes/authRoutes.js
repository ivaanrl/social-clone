const passport = require('passport');
require('../services/passport');
const uuid = require('uuid');

module.exports = app => {
  app.get('/users', (req, res) => {
    getAllUsers().then(user => res.json(user));
  });

  app.post(
    '/api/signup',
    passport.authenticate('local-signup'),
    async (req, res, next) => {
      try {
        req.session.user = await req.user.id;
        await sequelize.query(
          `INSERT INTO follows (id,user_id,follower_id)
          VALUES ('${uuid()}','${req.user.id}', '${req.user.id}')`
        );
        const response = await sequelize.query(
          `SELECT id, email, username, profile_pic_name FROM users WHERE id='${req.session.user}'`
        );

        res.json(response[0][0]);
      } catch (error) {
        res.json(error);
      }
    }
  );

  app.post(
    '/api/signin',
    passport.authenticate('local-signin'),
    async (req, res, next) => {
      try {
        req.session.user = req.user.id;
        const response = await sequelize.query(
          `SELECT id, email, username, profile_pic_name FROM users WHERE id='${req.session.user}'`
        );

        res.json(response[0][0]);
      } catch (error) {
        res.json(error);
      }
    }
  );

  app.get('/api/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  app.get('/api/current_user', (req, res) => {
    res.json(req.session);
  });
};
