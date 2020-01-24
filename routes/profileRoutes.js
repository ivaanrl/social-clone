const sequelize = require('../config/postgres.config');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'uploads');
  },
  filename: (req, file, callback) => {
    callback(null, `profilePicture_${file.originalname}`);
  }
});

const upload = multer({ storage });

module.exports = app => {
  app.post('/api/profile/basicInfo', async (req, res) => {
    try {
      const profileInfo = await sequelize.query(
        `SELECT first_name,last_name,email,about, users."createdAt", COUNT(*) as twoot_count 
         FROM users 
         INNER JOIN twoots 
          ON twoots.author_id = users.id 
         WHERE username='${req.body.username}' 
         GROUP BY first_name,last_name,email,about, users."createdAt"`
      );
      res.json(profileInfo[0][0]);
    } catch (error) {
      res.json(error);
    }
  });

  app.post(
    '/api/profile/uploadProfilePicture',
    upload.single('file'),
    (req, res, next) => {
      const file = req.file;
      console.log(file.filename);
      if (!file) {
        const error = new Error('Please upload a file');
        error.httpStatusCode = 400;
        return next(error);
      }
      res.send(file);
    }
  );
};
