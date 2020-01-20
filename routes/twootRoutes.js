const User = require('../models/user');
const Twoot = require('../models/twoot');
const uuid = require('uuid');

module.exports = app => {
  app.post('/api/twoot', (req, res) => {
    const id = uuid(); //CHECK CURRENT USER BETTER
    console.log(req.session);
    try {
      Twoot.create({
        id: id,
        authorId: req.session.user,
        content: req.content
      });
    } catch (error) {
      console.log(error);
    }
    res.json(req.session);
  });
};
