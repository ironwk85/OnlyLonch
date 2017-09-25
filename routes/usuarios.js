var express = require('express');
var bodyParser = require('body-parser');
var Usuario = require('../models/usuario.js')
var db = require('../db.js')
var router = express.Router();
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var sessionData = require('../session');
var sessionStore = new MySQLStore(sessionData.options);

/*
exports.register = function(req, res) {
	var id = req.body.id;
	var nombre = req.body.nombre;
	var phone = req.body.phone;
	var email = req.body.email;
	var pass = req.body.pass;
	var rememberMe = req.body.rememberMe;
	var photo = req.body.photo;

	if (photo==null || photo=="")
		photo = null;
	//res.send('POST request to the homepage\n'+req.body.nombre+'\n' + id + ',' + nombre + ','+ ap1 + ','+ ap2 + ','+ fechaNac + ','+ genero + ','+ noCel + ','+ noTel + ','+ ext + ','+ email + ','+ pass + ',');

	var response = {status:''};

	db.get().query('SELECT * FROM TB_CLIENTES WHERE Email = \'' + email + '\'', function (err, rows) {
	  	if (rows.length > 0){
	  		console.log("Dup");
	  		response.status = "DUPLICATE";
	  		res.send(JSON.stringify(response));
	  	}
	  	else{
	  		db.registerUserFirstTime(nombre,email,phone,pass,photo, function(err) {
			if (err)
				response.stauts = "ERROR";
			else{
				req.session.nombre = req.body.nombre;
	   			req.session.email = req.body.email;
	   			req.session.foto = req.body.photo;

	   			var user = new Usuario();
			  	user.setNombre(req.body.nombre);
			  	user.setEmail(req.body.email);
			  	user.setFoto(req.body.photo);
			  	user.setRememberMe(req.body.rememberMe);

			  	req.session.nombre = user.getNombre();
	   			req.session.email = user.getEmail();
	   			req.session.foto = user.getFoto();
	   			req.session.rememberMe = user.getRememberMe();

	   			if (rememberMe == "false"){
		   			var seconds = 31536000;
			    	req.session.cookie.expires = new Date(Date.now() + (seconds*1000));
		   		}
		   		else{
		   			var minute = 604800;
			    	req.session.cookie.expires = new Date(Date.now() + (minute*1000));
		   		}

				response.status = "SUCCESS";
				response.data = user;
			}
			res.send(JSON.stringify(response));
		})
	  	}
  	})
};
*/

exports.register = function(req, res) {
	var nombre = req.body.nombre;
	var apellido = req.body.apellido;
	var phone = req.body.celular;
	var email = req.body.email;
	var pass = req.body.contra;
	var photo = req.body.photo;
	var data;
	var response = {stat:''};
	
	data = {
		tables:{
			TB_CLIENTES: [
				{Nombre:nombre,Apellido_1:apellido,Email:email,No_Celular:parseInt(phone),Password:pass,Foto:photo},
			],
		},
	}
	db.fixtures(data, function(err) {
		if (err){
			response.status = "ERROR";
			response.data = err.code;
		}
		else{
			var user = new Usuario();
		  	user.setNombre(nombre);
		  	user.setEmail(email);
		  	user.setFoto(photo);
		  	req.session.nombre = user.getNombre();
		   	req.session.email = user.getEmail();
		   	req.session.foto = user.getFoto();
			req.session.cookie.expires = new Date(Date.now() + (31536000*1000));

			response.status = "SUCCESS";
		    response.data = user;
		}
		res.send(JSON.stringify(response));
	})
};

exports.login = function(req, res) {
	var email = req.body.email;
	var pass = req.body.pass;

	db.get().query('SELECT * FROM TB_CLIENTES WHERE Email = \'' + email + '\' and Password = \'' + pass + '\'', function (err, rows) {

		var response = {status:''};
	    
	    if (err){
	    	response.stauts = "ERROR";
	    	res.send(JSON.stringify(response)); 
	  	}

	  	if (rows.length > 0){
		  	var user = new Usuario();
		  	user.setNombre(rows[0].Nombre);
		  	user.setEmail(rows[0].Email);
		  	user.setFoto(rows[0].Foto);
		  	req.session.nombre = nombre;
		   	req.session.email = email;
		   	req.session.foto = foto;
			req.session.cookie.expires = new Date(Date.now() + (31536000*1000));

		    response.status = "SUCCESS";
		    response.data = user;
		}
		else{
			response.status = "NOT FOUND";
		}
		res.send(JSON.stringify(response));
	})
};


/*
exports.loginFacebook = function(req, res) {
	var email = req.body.email;
	var foto = req.body.foto;
	//var rememberMe = req.body.rememberMe;

	console.log(req.body);
	console.log('SELECT * FROM TB_CLIENTES WHERE Email = \'' + email + '\'');

	db.get().query('SELECT * FROM TB_CLIENTES WHERE Email = \'' + email + '\'', function (err, rows) {
		var response = {status:''};
	    if (err){
	    	response.stauts = "ERROR";
	    	res.send(JSON.stringify(status)); 
	  	}
	  	if (rows.length > 0){
		  	var user = new Usuario();
		  	user.setNombre(rows[0].Nombre);
		  	user.setEmail(rows[0].Email);
		  	user.setFacebook(rows[0].Facebook);

		  	if (rows[0].Foto && rows[0].Foto!="")
		  		user.setFoto(rows[0].Foto);
		  	else
		  		user.setFoto(foto);

		  	req.session.nombre = user.getNombre();
   			req.session.email = user.getEmail();
   			req.session.foto = user.getFoto();
   			req.session.facebook = user.getFacebook();
   			req.session.perfil = "user";

		    response.status = "SUCCESS";
		    response.data = user;
		}
		else{
			response.status = "ERROR";
		}
		res.send(JSON.stringify(response));
	})
};
*/
