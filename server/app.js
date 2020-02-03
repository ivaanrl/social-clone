const express = require('express');

const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const db = require('./models');
require('./services/passport');

const app = express();
const corsOptions = {
  origin: 'https://ivaanrl.github.io',
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());

app.use(
  session({
    store: new (require('connect-pg-simple')(session))(),
    secret: 'cats',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 3600 * 1000,
      sameSite: 'none'
    }
  })
);
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);
require('./routes/twootRoutes')(app);
require('./routes/profileRoutes')(app);
require('./routes/followRoutes')(app);
require('./routes/notificationRoutes')(app);
require('./routes/exploreRoutes')(app);
const PORT = process.env.PORT || 5000;

db.sequelize.sync().then(async () => {
  await sequelize.query(
    `
    CREATE TABLE IF NOT EXISTS "session" (
      "sid" varchar NOT NULL COLLATE "default" PRIMARY KEY NOT DEFERRABLE INITIALLY IMMEDIATE,
      "sess" json NOT NULL,
      "expire" timestamp(6) NOT NULL
    )
    WITH (OIDS=FALSE);
    `
  );

  await sequelize.query(
    `CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");`
  );
});
app.listen(PORT);
