var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('author', { title: 'Quiz-autores' });
});

module.exports = router;