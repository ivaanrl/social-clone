const express = require('express');

const cors = require('cors');
const passport = require('passport');
const session = require('express-session');

const db = require('./models');
require('./services/passport');

const app = express();

app.use(express.json());
app.use(cors());

app.use(
  session({
    secret: 'cats',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 24
    }
  })
);
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept'
  );
  next();
});

app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);
require('./routes/twootRoutes')(app);
require('./routes/profileRoutes')(app);
require('./routes/followRoutes')(app);
require('./routes/notificationRoutes')(app);
require('./routes/exploreRoutes')(app);
const PORT = process.env.PORT || 5000;

db.sequelize.sync().then(() => {});
app.listen(PORT);
