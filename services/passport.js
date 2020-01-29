const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt-node');
const uuid = require('uuid');
const { Op } = require('sequelize');

passport.serializeUser(function(user, done) {
  done(null, user.dataValues.id);
});

passport.deserializeUser((id, done) => {
  User.findOne({ where: { id: id } }).then(user => {
    done(null, user);
  });
});

passport.use(
  'local-signin',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    async (req, email, password, done) => {
      try {
        const logUser = await User.findOne({
          where: {
            [Op.or]: [{ email: email }, { username: email }]
          }
        });

        if (!logUser) {
          return done(null, false, { message: 'not such user' });
        }
        if (bcrypt.compareSync(password, logUser.password)) {
          return done(null, logUser);
        } else {
          return done(null, false, { message: 'not such user' });
        }
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  'local-signup',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    async (req, email, password, done) => {
      console.log(req.body);
      const existingUser = await User.findOne({
        where: {
          email: email
        }
      });
      if (existingUser) {
        return done(null, false);
      } else {
        try {
          const id = uuid();
          const newUser = await User.create({
            id: id,
            email: email,
            password: bcrypt.hashSync(req.body.password),
            first_name: req.body.firstname,
            last_name: req.body.lastname,
            username: req.body.username
          });
          return done(null, newUser);
        } catch (error) {
          done(error);
        }
      }
    }
  )
);
