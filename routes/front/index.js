const express   = require('express');
const { isLoggedIn, isNotLoggedIn } = require('../user/userMiddlewares');
const router    = express.Router();

const plasma    = require("./plasma");
const sensor    = require("./sensor");
const user      = require("./user");

router.use('/plasma', isLoggedIn, plasma);
router.use('/sensor', isLoggedIn, sensor);
router.use('/user', user);
module.exports  = router;