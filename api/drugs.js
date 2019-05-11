var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser'); 
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json()); 

 
  router.get('/:term', function(req, res, next) {
    var term=req.params.term;
    var url="https://www.dawini.tn/patient/findname/medicament?term=";
    fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(data)
      })
      .then((res) => res.json())
      .then((data) => res.status(200).send(data));
  });

  module.exports = router;