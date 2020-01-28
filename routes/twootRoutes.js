const Twoot = require('../models/twoot');
const uuid = require('uuid');
const sequelize = require('../config/postgres.config');
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    ensureExists(__dirname + `/uploads/${req.session.user}`, 0744, err => {});
    ensureExists(
      __dirname + `/uploads/${req.session.user}/twoot_pictures`,
      0744,
      err => {}
    );

    callback(null, __dirname + `/uploads/${req.session.user}/twoot_pictures`);
  },
  filename: (req, file, callback) => {
    callback(null, `${req.body.date}.${file.originalname}`);
  }
});

const upload = multer({ storage });

const ensureExists = (path, mask, cb) => {
  fs.mkdir(path, err => {
    if (err) {
      if (err.code == 'EEXIST') cb(null);
      else cb(err);
    } else cb(null);
  });
};

module.exports = app => {
  app.post('/api/twoot', upload.single('file'), async (req, res, next) => {
    const id = uuid();
    const file = req.file;
    const hashtags = req.body.hashtags.split(' ');
    try {
      let img_name = null;
      if (file) {
        img_name = `${req.body.date}.${file.originalname}`;
      }
      await Twoot.create({
        id: id,
        author_id: req.session.user,
        content: req.body.content,
        img_name,
        hashtags
      });
      res.json(req.session);
    } catch (error) {
      res.json(error);
    }
  });

  app.post(
    '/api/twoot/reply',
    upload.single('file'),
    async (req, res, next) => {
      const id = uuid();
      const file = req.file;

      const hashtags = req.body.hashtags.split(' ');
      try {
        let img_name = null;
        if (file) {
          img_name = `${req.body.date}.${file.originalname}`;
        }
        await Twoot.create({
          id: id,
          author_id: req.session.user,
          content: req.body.content,
          img_name,
          hashtags,
          parent_twoot: req.body.parent_twoot_id
        });
        await sequelize.query(`
        UPDATE twoots
        SET child_twoots = array_append(child_twoots, '${id}' )
        WHERE id = '${req.body.parent_twoot_id}'; 
      `);
        res.json(req.session);
      } catch (error) {
        res.json(error);
      }
    }
  );

  app.get('/api/twoot/:page', async (req, res) => {
    try {
      const twoots = await sequelize.query(
        `SELECT DISTINCT first_name, last_name, content, twoots."createdAt",
        username, twoots.id AS twoot_id, users.id AS user_id, img_name, users.profile_pic_name AS profile_img_name
        FROM twoots  
        INNER JOIN users ON twoots.author_id = users.id 
        INNER JOIN follows ON follows.user_id = users.id
        WHERE follows.user_id IN (SELECT follower_id FROM follows
        WHERE user_id = '${req.session.user}')
        ORDER BY twoots."createdAt" DESC 
        LIMIT 15 
        OFFSET ${parseInt(req.params.page, 10)}*15
        `
      );

      res.json(twoots[0]);
    } catch (error) {
      res.json(error);
    }
  });

  app.get('/api/twoot/exploreTwoot/:page', async (req, res) => {
    try {
      const twoots = await sequelize.query(`
      SELECT first_name, last_name, content, twoots."createdAt",
      username, twoots.id AS twoot_id, users.id AS user_id, img_name, 
      users.profile_pic_name AS profile_img_name
      FROM twoots
      INNER JOIN users ON users.id = twoots.author_id
      INNER JOIN follows ON users.id = user_id
      WHERE follows.user_id NOT IN (SELECT follower_id FROM follows
              WHERE user_id = '${req.session.user}')
          
      ORDER BY twoots."createdAt" DESC
      LIMIT 15 
      OFFSET ${parseInt(req.params.page, 10)}*15
      `);
      res.json(twoots[0]);
    } catch (error) {
      res.json(error);
    }
  });

  app.get('/api/twoot/reply/:page/:parent_id', async (req, res) => {
    try {
      const twoots = await sequelize.query(`
      SELECT first_name, last_name, content, twoots."createdAt",
      username, twoots.id AS twoot_id, users.id AS user_id, img_name, 
      users.profile_pic_name AS profile_img_name
      FROM twoots
      INNER JOIN users ON twoots.author_id = users.id
      WHERE twoots.id = '${req.params.parent_id}' OR parent_twoot = '${
        req.params.parent_id
      }'
      ORDER BY twoots."createdAt" DESC
      LIMIT 15
      OFFSET ${parseInt(req.params.page, 10)}*15
      `);
      res.json(twoots[0]);
    } catch (error) {
      res.json(error);
    }
  });

  app.post('/api/userTwoots', async (req, res) => {
    try {
      const userTwoots = await sequelize.query(
        `SELECT first_name, last_name, content, twoots."createdAt", twoots.id AS twoot_id , users.id AS user_id, img_name, username, users.profile_pic_name AS profile_img_name FROM twoots INNER JOIN users on twoots.author_id = users.id 
        WHERE username='${req.body.username}' 
        ORDER BY twoots."createdAt" DESC
        LIMIT 15 
        OFFSET ${parseInt(req.body.page, 10)}*15
        `
      );
      res.json(userTwoots[0]);
    } catch (error) {
      res.json(error);
    }
  });

  app.post('/api/twoot/fav', async (req, res) => {
    try {
      const favExists = await sequelize.query(
        `SELECT * FROM favs WHERE user_id=(SELECT id FROM users where username='${req.body.username}') AND twoot_id='${req.body.twoot_id}' LIMIT 1`
      );

      if (favExists[1].rowCount === 0) {
        await sequelize.query(
          `
            INSERT INTO favs
            VALUES ('${uuid()}', (SELECT id FROM users where username='${
            req.body.username
          }'), '${req.body.twoot_id}')
          `
        );
      } else {
        await sequelize.query(
          `
          DELETE FROM favs WHERE user_id=(SELECT id FROM users WHERE username='${req.body.username}') AND twoot_id='${req.body.twoot_id}'
          `
        );
      }
      res.json('Success!');
    } catch (error) {
      res.json(error);
    }
  });

  app.post('/api/twoot/getFav', async (req, res) => {
    try {
      const isFaved = await sequelize.query(
        `
        SELECT id FROM favs WHERE user_id=(SELECT id FROM users WHERE username='${req.body.username}') AND twoot_id='${req.body.twoot_id}'
        `
      );

      if (isFaved[1].rowCount === 0) {
        res.json(false);
      } else {
        res.json(true);
      }
    } catch (error) {
      res.json(error);
    }
  });

  app.get('/api/twoots/getTwootImage/:user_id/:img_name', async (req, res) => {
    try {
      res.sendFile(
        __dirname +
          `/uploads/${req.params.user_id}/twoot_pictures/${req.params.img_name}`
      );
    } catch (error) {
      res.json(error);
    }
  });
};
