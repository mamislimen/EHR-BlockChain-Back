var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser'); 
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json()); 
var request = require('request');
 
  router.get('/:term', function(req, res, next) {
    var term=req.params.term;
    var url="https://www.dawini.tn/patient/findname/medicament?term="+term;
    request({
        uri: url,
        
      }).pipe(res);
    });
   

  module.exports = router;