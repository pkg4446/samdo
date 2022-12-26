const express = require('express');
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('./userMiddlewares');

const User = require('../../controller/user');

const router = express.Router();

router.get('/info', isLoggedIn, async (req, res, next) => {
  try {
    // 로그인 인증이 되었다면, req.user에서 유저 정보 확인 가능
    if (req.user) {
      // 로그인 인증된 유저 정보 가져오기     
      const { USER_EMAIL } = req.user; 
      const UserInfo = await User.info(USER_EMAIL);
      res.status(200).json(UserInfo);
    } else {
      res.status(200).json(null);
    }
  } catch(error) {
    console.error(error);
    next(error);
  }
});

router.post('/idCheck', isNotLoggedIn, async (req, res, next) => {  
  try {
    const { USER_EMAIL } = req.body;
    const exUser = await User.info(USER_EMAIL);
    let idcheck;
    if (exUser) {
      idcheck = {userCheck: true};
    }else{
      idcheck = {userCheck: exUser};
    }
    return res.json(idcheck);
  } catch (error) {
    console.error(error);
    let idcheck = {
      userCheck:  "fail",
                  };
    next(error);
    return res.json(idcheck);
  }
});

router.post('/join', isNotLoggedIn, async (req, res, next) => {
  for(const key of Object.keys(req.body)){
    if(req.body[key]==""){
      let nullcheck = {
        Check:  "null",
      };
      return res.json(nullcheck);
    }
  }
  try {    
    const exUser = await User.info(req.body);
    if (exUser) {
      const idcheck = {userCheck: true};
      return res.json(idcheck);
    }
    const passFail = await User.join(req.body);
    const joinOk = {loginState:  passFail};
    return res.json(joinOk);
  } catch (error) {
    console.error(error);
    const joinFail = {loginState:  false};
    next(error);
    return res.json(joinFail);
  }
});


router.post('/passChange', async (req, res, next) => {
  for(const key of Object.keys(req.body)){
    if(req.body[key]==""){
      const nullcheck = {Check:  "null"};
      return res.json(nullcheck);
    }
  }
  try {
    const passFail = await User.passChange(req.body);
    const joinOk = { modifyState: passFail };
    return res.json(joinOk);
  } catch (error) {
    console.error(error);
    const joinFail = { modifyState: false };
    next(error);
    return res.json(joinFail);
  }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.send(false);
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.json(user.USER_NAME);
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

router.get('/logout', isLoggedIn, (req, res) => {
  req.session.destroy(function(err){
    if(err) throw err;
    res.render('user/logout');
  });
});

router.post('/session', (req, res) => {
  if(req.user)
  return res.json(req.user.USER_NICK);
  return res.send(false);
});

module.exports = router;
