const express = require('express');
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('./userMiddlewares');

const User = require('../../controller/user');

const router = express.Router();

router.post('/loginAPP', async (req, res, next) => {
  try {
    const response = {
      result: true,
      data:   await User.loginAPP(req.body)
  }
    console.log(response);
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

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
    const exUser = await User.info(req.body.USER_EMAIL);
    const response = {
      result: true,
      data:   null,
    }
    if (exUser) {
      response.result = false;
    }else{
      response.result = true;
    }
    return res.json(response);
  } catch (error) {
    console.error(error);
    response.result = false;
    return res.json(response);
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
  const response = {
    result: true,
    data:   null,
  }
  try {    
    const exUser = await User.info(req.body);
    if (exUser) {
      response.result = false;
      return res.json(response);
    }
    const passFail = await User.join(req.body);
    response.result = true;
    return res.json(response);
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
