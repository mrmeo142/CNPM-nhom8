var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/main');
});

router.get('/main', function(req,res,next){
  res.render('index');
})

module.exports = router;
