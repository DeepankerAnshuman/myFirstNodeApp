var express = require('express');
var router = express.Router();
var indexController = require('../controllers/index_controller.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  var data = [{}];
  res.render('index', { title: 'Daily Doctors Tracker', data: data });
});

router.post('/import', function(req, res, next) {
  var month = req.body.month;
  indexController.importDataFromExcel(month, function(result){
    res.writeHead(200, {'content-type': 'text/json' });
    res.write( JSON.stringify(result));
    res.end();
  });
});

router.post('/saveData', function(req, res, next) {
  var data = JSON.parse(req.body.data);
  indexController.saveData(data, function(result){
    res.writeHead(200, {'content-type': 'text/json' });
    res.write( JSON.stringify(result));
    res.end();
  });
});

router.get('/fetchDates', function(req, res, next){
  indexController.fetchDates(function(data){
    res.writeHead(200, {'content-type': 'text/json' });
    res.write( JSON.stringify(data));
    res.end();
  });
});

module.exports = router;
