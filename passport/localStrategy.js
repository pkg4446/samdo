const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user');

module.exports = () => {
  passport.use(new LocalStrategy({
    usernameField: 'USER_EMAIL',
    passwordField: 'USER_PASS',
  }, async (USER_EMAIL, USER_PASS, done) => {
    try {
      const exUser = await User.findOne({ where: { USER_EMAIL } });
      if (exUser) {
        const result = await bcrypt.compare(USER_PASS, exUser.USER_PASS);
        if (result) {
          done(null, exUser);
        } else {
          done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
        }
      } else {
        done(null, false, { message: '가입되지 않은 회원입니다.' });
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};
