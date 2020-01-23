const express = require('express');
const sequelize = require('./config/postgres.config');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const User = require('./models/user');
const Twoots = require('./models/twoot');
const Favs = require('./models/fav');
const Follows = require('./models/follows');
const Messages = require('./models/messages');
const Notifications = require('./models/notifications');

require('./services/passport');

sequelize
  .authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));

User.sync();
Twoots.sync();
Favs.sync();
Follows.sync();
Notifications.sync();
Messages.sync();

const app = express();

app.use(express.json());
app.use(cors());

app.use(
  session({
    secret: 'cats',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 2592000000
    }
  })
);
app.use(passport.initialize());
app.use(passport.session());
//app.use(express.urlencoded({ extended: false }));

require('./routes/authRoutes')(app);
require('./routes/twootRoutes')(app);
require('./routes/profileRoutes')(app);
require('./routes/followRoutes')(app);
require('./routes/notificationRoutes')(app);
const PORT = process.env.PORT || 5000;

app.listen(PORT);
