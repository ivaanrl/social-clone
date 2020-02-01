module.exports = app => {
  app.post('/api/profile/basicInfo', async (req, res, next) => {
    try {
      const profileInfo = await sequelize.query(
        `SELECT users.id,first_name,last_name,email,about, users."createdAt", about,profile_pic_name AS profile_img_name, cover_pic_name,
         (SELECT COUNT(*) FROM FOLLOWS WHERE user_id = (SELECT id FROM users WHERE username='${req.body.username}')) AS following,
        (SELECT COUNT(*) FROM follows where follower_id = (SELECT id FROM users WHERE username='${req.body.username}')) AS followers
             FROM users 
             
             WHERE username='${req.body.username}' 
             GROUP BY first_name,last_name,email,about, users."createdAt", profile_img_name, cover_pic_name, users.id
    `
      );
      const twootCount = await sequelize.query(`
      SELECT COUNT(*) AS twoot_count FROM twoots WHERE author_id = (SELECT id FROM users WHERE username='${req.body.username}')
      `);
      if (!profileInfo) {
        next(error);
      }

      profileInfo[0][0].twoot_count = twootCount[0][0].twoot_count.toString();

      res.json(profileInfo[0][0]);
    } catch (error) {
      res.json(error);
    }
  });

  app.post('/api/profile/saveChanges', async (req, res, next) => {
    const profilePic = req.body.profilePic;
    const coverPic = req.body.coverPic;
    try {
      if (profilePic) {
        await sequelize.query(`
          UPDATE users
          SET profile_pic_name= '${profilePic}'
          WHERE id = '${req.session.user}'
          `);
      }

      if (coverPic) {
        await sequelize.query(`
          UPDATE users
          SET cover_pic_name= '${coverPic}'
          WHERE id = '${req.session.user}'
          `);
      }

      res.json('success!');
    } catch (error) {}
  });
};
