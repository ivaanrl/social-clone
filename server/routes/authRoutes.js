const passport = require('passport');
const sequelize = require('../config/postgres.config');
require('../services/passport');
const User = require('../models/user');

module.exports = app => {
  app.get('/users', (req, res) => {
    getAllUsers().then(user => res.json(user));
  });

  app.post(
    '/api/signup',
    passport.authenticate('local-signup'),
    async (req, res, next) => {
      req.session.user = await req.user.id;
      res.json(req.user.id);
    }
  );

  app.post(
    '/api/signin',
    passport.authenticate('local-signin'),
    async (req, res, next) => {
      req.session.user = req.user.id;

      const response = await sequelize.query(
        `SELECT id, email, username, profile_pic_name FROM users WHERE id='${req.session.user}'`
      );
      res.json(response[0][0]);
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

const getAllUsers = async () => {
  return await User.findAll();
};
