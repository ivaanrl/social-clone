const uuid = require('uuid');

module.exports = app => {
  app.post('/api/twoot', async (req, res, next) => {
    const id = uuid();
    const hashtags = req.body.hashtags.trim().split(' ');
    const formatedHashtags = [];
    hashtags.forEach(word => {
      formatedHashtags.push(`'${word}'`);
    });

    const file = req.body.image;

    try {
      let img_name = null;
      if (file) {
        img_name = file;
        await sequelize.query(`
        INSERT INTO twoots (id,author_id,content,Img_name,hashtags, "createDate")
        VALUES ('${id}', '${req.session.user}', '${
          req.body.content
        }', '${img_name}', ARRAY[${formatedHashtags}], '${Date.now()}' )
        `);
      } else {
        await sequelize.query(`
        INSERT INTO twoots (id,author_id,content,hashtags, "createDate")
        VALUES ('${id}', '${req.session.user}', '${
          req.body.content
        }', ARRAY[${formatedHashtags}], '${Date.now()}' )
      `);
      }
      const twoot = await sequelize.query(`
      SELECT first_name, last_name, content, twoots."createDate",
        username, twoots.id AS twoot_id, users.id AS user_id, img_name, users.profile_pic_name AS profile_img_name
        FROM twoots  
        INNER JOIN users ON twoots.author_id = users.id 
        WHERE twoots.id = '${id}' `);

      res.json(twoot[0]);
    } catch (error) {
      res.json(error);
    }
  });

  app.post('/api/twoot/reply', async (req, res) => {
    const id = uuid();
    const file = req.body.image;

    const hashtags = req.body.hashtags.split(' ');
    const formatedHashtags = [];
    hashtags.forEach(word => {
      formatedHashtags.push(`'${word}'`);
    });
    try {
      let img_name = null;
      if (file) {
        img_name = file;
        await sequelize.query(`
        INSERT INTO twoots (id,author_id,content,Img_name,hashtags,parent_twoot, "createDate")
        VALUES ('${id}', '${req.session.user}', '${
          req.body.content
        }', '${img_name}', ARRAY[${formatedHashtags}],'${
          req.body.parent_twoot_id
        }', '${Date.now()}' )
      `);
      } else {
        await sequelize.query(`
        INSERT INTO twoots (id,author_id,content,hashtags,parent_twoot, "createDate")
        VALUES ('${id}', '${req.session.user}', '${
          req.body.content
        }', ARRAY[${formatedHashtags}],'${
          req.body.parent_twoot_id
        }', '${Date.now()}' )
      `);
      }
      res.json(req.session);
    } catch (error) {
      res.json(error);
    }
  });

  app.get('/api/twoot/:page', async (req, res) => {
    try {
      const twoots = await sequelize.query(
        `SELECT DISTINCT first_name, last_name, content, twoots."createDate",
        username, twoots.id AS twoot_id, users.id AS user_id, img_name, users.profile_pic_name AS profile_img_name
        FROM twoots  
        INNER JOIN users ON twoots.author_id = users.id 
        INNER JOIN follows ON follows.user_id = users.id
        WHERE follows.user_id IN (SELECT follower_id FROM follows
        WHERE user_id = '${req.session.user}')
        ORDER BY twoots."createDate" DESC 
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
      SELECT first_name, last_name, content, twoots."createDate",
      username, twoots.id AS twoot_id, users.id AS user_id, img_name, 
      users.profile_pic_name AS profile_img_name
      FROM twoots
      INNER JOIN users ON users.id = twoots.author_id
      INNER JOIN follows ON users.id = user_id
      WHERE follows.user_id NOT IN (SELECT follower_id FROM follows
              WHERE user_id = '${req.session.user}')
          
      ORDER BY twoots."createDate" DESC
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
      SELECT first_name, last_name, content, twoots."createDate",
      username, twoots.id AS twoot_id, users.id AS user_id, img_name, 
      users.profile_pic_name AS profile_img_name
      FROM twoots
      INNER JOIN users ON twoots.author_id = users.id
      WHERE twoots.id = '${req.params.parent_id}' OR parent_twoot = '${
        req.params.parent_id
      }'
      ORDER BY twoots."createDate" DESC
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
        `SELECT first_name, last_name, content, twoots."createDate", twoots.id AS twoot_id , users.id AS user_id, img_name, username, users.profile_pic_name AS profile_img_name FROM twoots INNER JOIN users on twoots.author_id = users.id 
        WHERE username='${req.body.username}' 
        ORDER BY twoots."createDate" DESC
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
};
