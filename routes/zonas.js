var express = require('express');
var Zona = require('../models/zona.js')
var db = require('../db.js')

var router = express.Router();

exports.all = function(req, res) {
	db.get().query('SELECT * FROM CAT_ZONAS', function (err, rows) {
		var response = {status:''};
	    if (err){
	    	response.stauts = "ERROR";
	    	res.send(JSON.stringify(status)); 
	  	}
	  	var zonas = new Array();
	    for (var i in rows) {
	    	console.log(rows[i]);
	      zonas.push(new Zona(rows[i].ID_Zona,rows[i].Zona,rows[i].Descripcion));
	    }
	    response.status = "SUCCESS";
	    response.data = zonas;
	    res.send(JSON.stringify(response));
	})
};
