const express   = require('express');
const { isLoggedIn, isNotLoggedIn } = require('../user/userMiddlewares');
const router    = express.Router();

const plasma    = require("./plasma");
const reducer   = require("./reducer");
const sensor    = require("./sensor");
const user      = require("./user");

router.use('/plasma', isLoggedIn, plasma);
router.use('/reducer', isLoggedIn, reducer);
router.use('/sensor', isLoggedIn, sensor);
router.use('/user', user);
module.exports  = router;