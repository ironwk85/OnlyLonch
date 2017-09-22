var express = require('express');
var Zona = require('../models/zona.js')
var db = require('../db.js')

var router = express.Router();

router.get('/', function(req, res, next) {
	res.send("ERROR");
});

module.exports = router;
