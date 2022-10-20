const express   = require('express');
const router    = express.Router();

const plasma    = require("./plasma");

router.use('/plasma', plasma);
module.exports  = router;