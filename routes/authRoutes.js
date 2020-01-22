const passport = require('passport');
require('../services/passport');

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
    (req, res, next) => {
      req.session.user = req.user.id;
      const response = {
        email: req.user.email,
        username: req.user.username,
        id: req.user.id
      };
      res.json(response);
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
