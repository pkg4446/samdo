const express   = require('express');
const router    = express.Router();

const plasma    = require("./plasma");
const sensor    = require("./sensor");
const user      = require("./user");

router.use('/plasma', plasma);
router.use('/sensor', sensor);
router.use('/user', user);
module.exports  = router;