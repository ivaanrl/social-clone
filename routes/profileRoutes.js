const sequelize = require('../config/postgres.config');
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    ensureExists(__dirname + `/uploads/${req.session.user}`, 0744, err => {});
    ensureExists(
      __dirname + `/uploads/${req.session.user}/profile_pictures`,
      0744,
      err => {}
    );

    callback(null, __dirname + `/uploads/${req.session.user}/profile_pictures`);
  },
  filename: (req, file, callback) => {
    callback(null, `${file.fieldname}.${file.originalname}`);
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
  app.post('/api/profile/basicInfo', async (req, res) => {
    try {
      const profileInfo = await sequelize.query(
        `SELECT users.id,first_name,last_name,email,about, users."createdAt", about,profile_pic_name AS profile_img_name, cover_pic_name,
        COUNT(*) as twoot_count, (SELECT COUNT(*) FROM FOLLOWS WHERE user_id = (SELECT id FROM users WHERE username='${req.body.username}')) AS following,
        (SELECT COUNT(*) FROM follows where follower_id = (SELECT id FROM users WHERE username='${req.body.username}')) AS followers
             FROM users 
             INNER JOIN twoots 
              ON twoots.author_id = users.id 
             WHERE username='${req.body.username}' 
             GROUP BY first_name,last_name,email,about, users."createdAt", profile_img_name, cover_pic_name, users.id
    `
      );
      res.json(profileInfo[0][0]);
    } catch (error) {
      res.json(error);
    }
  });

  app.post(
    '/api/profile/saveChanges',
    upload.fields([
      {
        name: 'profilepic',
        maxCount: 1
      },
      {
        name: 'coverpic',
        maxCount: 1
      }
    ]),
    async (req, res, next) => {
      const profilePic = req.files.profilepic[0];
      const coverPic = req.files.coverpic[0];
      try {
        let profile_name = null;
        let cover_name = null;

        if (profilePic) {
          profile_name = `${profilePic.fieldname}.${profilePic.originalname}`;
          await sequelize.query(`
          UPDATE users
          SET profile_pic_name= '${profile_name}'
          WHERE id = '${req.session.user}'
          `);
        }

        if (coverPic) {
          cover_name = `${coverPic.fieldname}.${coverPic.originalname}`;
          await sequelize.query(`
          UPDATE users
          SET over_pic_name= '${cover_name}'
          WHERE id = '${req.session.user}'
          `);
        }
        res.json('success!');
      } catch (error) {}
    }
  );

  app.get(
    '/api/profile/getProfilePicture/:user_id/:img_name',
    async (req, res) => {
      try {
        res.sendFile(
          __dirname +
            `/uploads/${req.params.user_id}/profile_pictures/${req.params.img_name}`
        );
      } catch (error) {
        console.log(error);
      }
    }
  );
};
