var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(`https://${req.hostname}/index.html`);
  res.redirect(`https://${req.hostname}/index.html`);
});

module.exports = router;