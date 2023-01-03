const express   = require('express');
const router    = express.Router();

const plasma    = require("./plasma");
const reducer   = require("./reducer");
const sensor    = require("./sensor");

router.use('/plasma', plasma);
router.use('/reducer', reducer);
router.use('/sensor', sensor);
module.exports  = router;