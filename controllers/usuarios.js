var express = require('express');
var bodyParser = require('body-parser');

var Usuario = require('../models/usuario.js')
var db = require('../db.js')

var router = express.Router();

//Here we are configuring express to use body-parser as middle-ware.
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/', function (req, res) {
	var id = req.body.id;
	var nombre = req.body.nombre;
	var ap1 = req.body.ap1;
	var ap2 = req.body.ap2;
	var fechaNac = req.body.fechaNac;
	var genero = req.body.genero;
	var noCel = req.body.noCel;
	var noTel = req.body.noTel;
	var ext = req.body.ext;
	var email = req.body.email;
	var pass = req.body.pass;

	req.session.userName = nombre;

	res.send('POST request to the homepage\n'+req.body.nombre+'\n' + id + ',' + nombre + ','+ ap1 + ','+ ap2 + ','+ fechaNac + ','+ genero + ','+ noCel + ','+ noTel + ','+ ext + ','+ email + ','+ pass + ',');
});

module.exports = router;
