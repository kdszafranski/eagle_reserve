var express = require('express');
var router = express.Router();

router.get('/', user, function(req, res) {
  var homePath = path.join(__dirname, '../public/views/index.html');
  res.sendFile(homePath);

});




module.exports = router;
