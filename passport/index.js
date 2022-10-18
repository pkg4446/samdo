const passport  = require('passport');
const local     = require('./localStrategy');
const User      = require('../models/user');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.USER_EMAIL);
  });

  passport.deserializeUser((USER_EMAIL, done) => {
    User.findOne({ where: { USER_EMAIL } })
      .then(user => done(null, user))
      .catch(err => done(err));
  });

  local();
};
