var express = require('express');
var bodyParser = require('body-parser');
var Usuario = require('../models/usuario.js')
var Direccion = require('../models/direccion.js')
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
	var response = {};
	
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
	var pass = req.body.password;

	db.get().query('SELECT * FROM TB_CLIENTES WHERE (Email = \'' + email + '\' and Password = \'' + pass + '\') or (No_Celular = CONVERT(\'' + email + '\',UNSIGNED INTEGER) and Password = \'' + pass + '\')', function (err, rows) {
	console.log('SELECT * FROM TB_CLIENTES WHERE (Email = \'' + email + '\' and Password = \'' + pass + '\') or (No_Celular = CONVERT(\'' + email + '\',UNSIGNED INTEGER) and Password = \'' + pass + '\')');

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
		  	req.session.idUsuario = rows[0].Id_Cliente;
		  	req.session.nombre = user.getNombre();
		   	req.session.email = user.getEmail();
		   	req.session.foto = user.getFoto();
		   	req.session.perfil = "user";
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

exports.loginFacebook = function(req, res) {
	var email = req.body.email;

	console.log('SELECT * FROM TB_CLIENTES WHERE Email = \'' + email + '\'');
	db.get().query('SELECT * FROM TB_CLIENTES WHERE Email = \'' + email + '\'', function (err, rows) {

		var response = {status:''};
		console.log(rows);
	    if (err){
	    	response.stauts = "ERROR";
	  	}
	  	if (rows.length > 0){
	  		var user = new Usuario();
		  	user.setNombre(rows[0].Nombre);
		  	user.setEmail(rows[0].Email);
		  	user.setFoto(rows[0].Foto);
		  	req.session.idUsuario = rows[0].Id_Cliente;
		  	req.session.nombre = user.getNombre();
		   	req.session.email = user.getEmail();
		   	req.session.foto = user.getFoto();
		   	req.session.perfil = "user";
			req.session.cookie.expires = new Date(Date.now() + (31536000*1000));

		    response.status = "SUCCESS";
		    response.data = user;
		}
		else{
			response.status = "NOT LOGGED";
		}
		res.send(JSON.stringify(response));
	})
};

exports.insertDireccion = function(req, res) {
	var dir = req.body.direccion;
	var nom = req.body.nombre;
	var lat = req.body.latitud;
	var longi = req.body.longitud;
	var coment = req.body.comentarios;
	var cl = req.session.idUsuario;
	var data;
	var response = {};
	var values = [dir,lat,longi,coment,1];

	db.get().query('INSERT INTO TB_DIRECCION (direccion, latitud, longitud, comentarios, CAT_ZONAS_ID_Zona) VALUES(?, ?, ?, ?, ?)', values, function(err, result) {
    	if (err){
    		console.log(err);
	    	response.stauts = "ERROR al insertar en TB_DIRECCION";
	    	res.send(JSON.stringify(response));
	    }
	  	else{
	  		values = [nom,cl,result.insertId];
	  		db.get().query('INSERT INTO JN_CLIENTES_DIR (nombre, TB_CLIENTES_id_cliente, TB_DIRECCION_id_direccion) VALUES(?, ?, ?)', values, function(err, result) {
		    	if (err){
		    		console.log(err);
			    	response.stauts = "ERROR al insertar en JN_CLIENTS_DIR";
			    	res.send(JSON.stringify(response));
		    	}
			  	else{
				    response.status = "SUCCESS";
				}
		  	})
		    response.status = "SUCCESS";
		}
		res.send(JSON.stringify(response));
  	});
};

exports.getDirecciones = function(req, res) {
	var cl = req.session.idUsuario;

	console.log('SELECT D.* FROM TB_DIRECCION D, TB_CLIENTES C, JN_CLIENTES_DIR CD  WHERE (C.Id_Cliente='+cl+' AND C.Id_Cliente=CD.TB_CLIENTES_id_cliente AND D.Id_Direccion=CD.TB_DIRECCION_id_direccion);');
	db.get().query('SELECT D.* FROM TB_DIRECCION D, TB_CLIENTES C, JN_CLIENTES_DIR CD  WHERE (C.Id_Cliente='+cl+' AND C.Id_Cliente=CD.TB_CLIENTES_id_cliente AND D.Id_Direccion=CD.TB_DIRECCION_id_direccion);', function (err, rows) {	

		var response = {status:''};
	    
	    if (err){
	    	response.stauts = "ERROR";
	    	res.send(JSON.stringify(response)); 
	  	}

	  	if (rows.length > 0){
		  	var direccion = new Direccion();
		  	direccion.setId(rows[0].ID_DIreccion);
		  	direccion.setDireccion(rows[0].direccion);
		  	direccion.setLatitud(rows[0].Latitud);
		  	direccion.setLongitud(rows[0].Longitud);
		  	direccion.setComentarios(rows[0].Comentarios);
			req.session.cookie.expires = new Date(Date.now() + (31536000*1000));

		    response.status = "SUCCESS";
		    response.data = direccion;
		}
		else{
			response.status = "NOT FOUND";
		}
		res.send(JSON.stringify(response));
	})
};
