
var express = require('express');
var bodyParser = require('body-parser');
var Empleado = require('../models/empleado.js')
var Platillo = require('../models/platillo.js')
var Foodlist = require('../models/foodlist.js')
var Programacion = require('../models/programacion.js')
var Perfil = require('../models/perfil.js')
var Categoria = require('../models/categoria.js')
var db = require('../db.js')
var router = express.Router();
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var sessionData = require('../session');
var sessionStore = new MySQLStore(sessionData.options);
var nodeExcel=require('excel-export-impr');

/**************************************************************/
/*********************Login & Logout***************************/
/**************************************************************/

exports.login = function(req, res) {
	var email = req.body.email;
	var pass = req.body.pass;

	db.get().query('SELECT e.Nombre, e.Email, p.Permisos FROM TB_EMPLEADOS e, CAT_PERFILES p WHERE Password IS NOT NULL AND Email = \'' + email + '\' AND Password = \'' + pass + '\' AND e.CAT_PERFILES_ID_Perfil = p.ID_Perfil', function (err, rows) {
	console.log('SELECT e.Nombre, e.Email, p.Permisos FROM TB_EMPLEADOS e, CAT_PERFILES p WHERE Password IS NOT NULL AND Email = \'' + email + '\' AND Password = \'' + pass + '\' AND e.CAT_PERFILES_ID_Perfil = p.ID_Perfil');
		var response = {status:''};
	    
	    if (err){
	    	response.stauts = "ERROR";
	    	res.send(JSON.stringify(response)); 
	  	}

	  	if ( rows && rows.length > 0){
		  	var empleado = new Empleado();
		  	empleado.setNombre(rows[0].Nombre);
		  	empleado.setEmail(rows[0].Email);
		  	empleado.setPermisos(rows[0].Permisos);

		  	req.session.nombre = empleado.getNombre();
   			req.session.email = empleado.getEmail();
   			req.session.permisos = empleado.getPermisos();
   			req.session.perfil = "admin";

	   		var seconds = 31536000;
		    req.session.cookie.expires = new Date(Date.now() + (seconds*1000));

		    response.status = "SUCCESS";
		    //response.data = empleado;
		}
		else{
			response.status = "ERROR";
		}
		res.send(JSON.stringify(response));
	})
}

/**************************************************************/
/**************************************************************/
/**************************************************************/

//tipo = 1 = todos
//tipo = 2 = con contraseña
//tipo = 3 = sin contraseña
exports.getEmpleados = function(req, res) {
	var inicio = req.body.inicio;
	var fin = req.body.fin;
	var busqueda = req.body.busqueda;
	var tipo = req.body.tipo;
	var response = {status:''};
	var textoQuery = "";

	if (tipo == "1"){
		if (busqueda==null || busqueda=="")
			textoQuery = 'SELECT e.*, p.Perfil FROM TB_EMPLEADOS e, CAT_PERFILES p WHERE p.ID_Perfil = e.CAT_PERFILES_ID_Perfil ORDER BY Nombre LIMIT ' + inicio + ', ' + fin;
		else
			textoQuery = 'SELECT e.*, p.Perfil FROM TB_EMPLEADOS e, CAT_PERFILES p WHERE (p.ID_Perfil = e.CAT_PERFILES_ID_Perfil) and ( e.Nombre LIKE "%' + busqueda + '%" OR e.Apellido_1 LIKE "%' + busqueda + '%" OR e.Apellido_2 LIKE "%' + busqueda + '%" OR e.Email LIKE "%' + busqueda + '%" ) ORDER BY e.Nombre LIMIT ' + inicio + ', ' + fin;
	}
	else if (tipo == "2"){
		if (busqueda==null || busqueda=="")
			textoQuery = 'SELECT e.*, p.Perfil FROM TB_EMPLEADOS e, CAT_PERFILES p WHERE e.Password IS NOT NULL AND p.ID_Perfil = e.CAT_PERFILES_ID_Perfil ORDER BY Nombre LIMIT ' + inicio + ', ' + fin;
		else
			textoQuery = 'SELECT e.*, p.Perfil FROM TB_EMPLEADOS e, CAT_PERFILES p WHERE (e.Password IS NOT NULL) AND (p.ID_Perfil = e.CAT_PERFILES_ID_Perfil) and ( e.Nombre LIKE "%' + busqueda + '%" OR e.Apellido_1 LIKE "%' + busqueda + '%" OR e.Apellido_2 LIKE "%' + busqueda + '%" OR e.Email LIKE "%' + busqueda + '%" ) ORDER BY e.Nombre LIMIT ' + inicio + ', ' + fin;
	}
	else if (tipo == "3"){
		if (busqueda==null || busqueda=="")
			textoQuery = 'SELECT e.*, p.Perfil FROM TB_EMPLEADOS e, CAT_PERFILES p WHERE e.Password IS NULL AND p.ID_Perfil = e.CAT_PERFILES_ID_Perfil ORDER BY Nombre LIMIT ' + inicio + ', ' + fin;
		else
			textoQuery = 'SELECT e.*, p.Perfil FROM TB_EMPLEADOS e, CAT_PERFILES p WHERE (e.Password IS NULL) AND (p.ID_Perfil = e.CAT_PERFILES_ID_Perfil) and ( e.Nombre LIKE "%' + busqueda + '%" OR e.Apellido_1 LIKE "%' + busqueda + '%" OR e.Apellido_2 LIKE "%' + busqueda + '%" OR e.Email LIKE "%' + busqueda + '%" ) ORDER BY e.Nombre LIMIT ' + inicio + ', ' + fin;
	}

	db.get().query(textoQuery, function (err, rows) {
		console.log(textoQuery);
	    if (err){
	    	response.stauts = "ERROR";
	    	res.send(JSON.stringify(response));
	  	}

	  	if ( rows && rows.length > 0){
	  		var empleados = [];
	  		for (var i=0; i<rows.length; i++){
	  			var empleado = new Empleado();
	  			empleado.setId(rows[i].ID_Empleado);
	  			empleado.setNombre(rows[i].Nombre);
	  			empleado.setApellido1(rows[i].Apellido_1);
	  			empleado.setApellido2(rows[i].Apellido_2);
	  			empleado.setNombreCompleto(rows[i].Nombre + " " + rows[i].Apellido_1 + " " + rows[i].Apellido_2);
	  			empleado.setNoCel(rows[i].No_Celular);
	  			empleado.setNoTel(rows[i].No_TelFijo);
	  			empleado.setEmail(rows[i].Email);
	  			empleado.setCalificacion(rows[i].Calificacion?rows[i].Calificacion:'');
	  			empleado.setNoInt(rows[i].Num_Int?rows[i].Num_Int:'');
	  			empleado.setNoExt(rows[i].Num_Ext?rows[i].Num_Ext:'');
	  			empleado.setCalle(rows[i].Calle?rows[i].Calle:'');
	  			empleado.setColonia(rows[i].Colonia?rows[i].Colonia:'');
	  			empleado.setCiudad(rows[i].Ciudad?rows[i].Ciudad:'');
	  			empleado.setMunicipio(rows[i].Municipio?rows[i].Municipio:'');
	  			empleado.setEstado(rows[i].Estado?rows[i].Estado:'');
	  			empleado.setCp(rows[i].CP?rows[i].CP:'');
	  			empleado.setPerfil(rows[i].Perfil?rows[i].Perfil:'');
	  			empleados.push(empleado);
	  		}

		    response.status = "SUCCESS";
		    response.data = empleados;
		}
		else{
			response.status = "ERROR";
		}
		res.send(JSON.stringify(response));
	})
};

exports.getNumEmpleados = function(req, res) {
	var inicio = req.body.inicio;
	var fin = req.body.fin;
	var response = {status:''};
	var busqueda = req.body.busqueda;
	var tipo = req.body.tipo;
	var textoQuery = "";

	if (tipo == "1"){
		if (busqueda==null || busqueda=="")
		textoQuery = 'SELECT COUNT(1) AS num FROM TB_EMPLEADOS';
	else
		textoQuery = 'SELECT COUNT(1) AS num FROM TB_EMPLEADOS WHERE Nombre LIKE "%' + busqueda + '%" OR Apellido_1 LIKE "%' + busqueda + '%" OR Apellido_2 LIKE "%' + busqueda + '%" OR Email LIKE "%' + busqueda + '%"';
	}
	else if (tipo == "2"){
		if (busqueda==null || busqueda=="")
		textoQuery = 'SELECT COUNT(1) AS num FROM TB_EMPLEADOS WHERE Password IS NOT NULL';
	else
		textoQuery = 'SELECT COUNT(1) AS num FROM TB_EMPLEADOS WHERE (Password IS NOT NULL) AND Nombre LIKE "%' + busqueda + '%" OR Apellido_1 LIKE "%' + busqueda + '%" OR Apellido_2 LIKE "%' + busqueda + '%" OR Email LIKE "%' + busqueda + '%"';
	}
	else if (tipo == "3"){
		if (busqueda==null || busqueda=="")
		textoQuery = 'SELECT COUNT(1) AS num FROM TB_EMPLEADOS WHERE Password IS NULL';
	else
		textoQuery = 'SELECT COUNT(1) AS num FROM TB_EMPLEADOS WHERE (Password IS NULL) AND Nombre LIKE "%' + busqueda + '%" OR Apellido_1 LIKE "%' + busqueda + '%" OR Apellido_2 LIKE "%' + busqueda + '%" OR Email LIKE "%' + busqueda + '%"';
	}

	db.get().query(textoQuery, function (err, rows) {
		console.log(textoQuery);
	    if (err){
	    	response.stauts = "ERROR";
	    	res.send(JSON.stringify(response));
	  	}

	  	if ( rows && rows.length > 0){
	  		response.status = "SUCCESS";
		    response.cantidad = rows[0].num;
		}
		else{
			response.status = "ERROR";
		}
		res.send(JSON.stringify(response));
	})
};

exports.agregaEmpleado = function(req,res){
	var nombre = req.body.nombre;
    var appaterno = req.body.appaterno;
    var apmaterno = req.body.apmaterno;
    var email = req.body.email;
    var celular = req.body.celular;
    var telefono = req.body.telefono;
    var avenida = ((req.body.avenida!=null && req.body.avenida!="")?req.body.avenida:"");
	var	noExterior = ((req.body.noExterior!=null && req.body.noExterior!="")?req.body.noExterior:null);
	var noInterior = ((req.body.noInterior!=null && req.body.noInterior!="")?req.body.noInterior:null );
	var colonia = ((req.body.colonia!=null && req.body.colonia!="")?req.body.colonia:"");
	var ciudad = ((req.body.ciudad!=null && req.body.ciudad!="")?req.body.ciudad:"");
	var municipio = ((req.body.municipio!=null && req.body.municipio!="")?req.body.municipio:"");
	var estado = ((req.body.estado!=null && req.body.estado!="")?req.body.estado:"");
	var cp = ((req.body.cp!=null && req.body.cp!="")?req.body.cp:"");

    var response = {status:''};

    db.agregaEmpleado(nombre,appaterno,apmaterno,email,celular,telefono,avenida,noExterior,noInterior,colonia,ciudad,municipio,estado,cp, function(err) {
		if (err)
			response.status = "ERROR";
		else
			response.status = "SUCCESS";

		res.send(JSON.stringify(response));
	});
};

exports.eliminaEmpleados = function(req,res){
	var empleados = req.body.empleados;
	var response = {status:''};

    db.eliminaEmpleados(empleados, function(err) {
		if (err)
			response.status = "ERROR";
		else
			response.status = "SUCCESS";

		res.send(JSON.stringify(response));
	});
};

exports.actualizaEmpleado = function(req,res){
	var idEmpleado = req.body.idEmpleado;
	var nombre = req.body.nombre;
    var appaterno = req.body.appaterno;
    var apmaterno = req.body.apmaterno;
    var email = req.body.email;
    var celular = req.body.celular;
    var telefono = req.body.telefono;
    var avenida = ((req.body.avenida!=null && req.body.avenida!="")?req.body.avenida:"");
	var	noExterior = ((req.body.noExterior!=null && req.body.noExterior!="")?req.body.noExterior:null);
	var noInterior = ((req.body.noInterior!=null && req.body.noInterior!="")?req.body.noInterior:null );
	var colonia = ((req.body.colonia!=null && req.body.colonia!="")?req.body.colonia:"");
	var ciudad = ((req.body.ciudad!=null && req.body.ciudad!="")?req.body.ciudad:"");
	var municipio = ((req.body.municipio!=null && req.body.municipio!="")?req.body.municipio:"");
	var estado = ((req.body.estado!=null && req.body.estado!="")?req.body.estado:"");
	var cp = ((req.body.cp!=null && req.body.cp!="")?req.body.cp:"");

    var response = {status:''};

    db.actualizaEmpleado(idEmpleado,nombre,appaterno,apmaterno,email,celular,telefono,avenida,noExterior,noInterior,colonia,ciudad,municipio,estado,cp, function(err) {
		if (err)
			response.status = "ERROR";
		else
			response.status = "SUCCESS";

		res.send(JSON.stringify(response));
	});
};

exports.exportaEmpleados = function(req, res) {
	var busqueda = req.query.busqueda;
	var tipo = req.query.tipo;
	var response = {status:''};
	var textoQuery = "";
    var conf={}
    conf.cols=[{
            caption:'id',
            type:'number'
        },
        {
            caption:'nombre',
            type:'string'
        },
        {
            caption:'apPaterno',
            type:'string'
        },
        {
            caption:'apMaterno',
            type:'string'
        },
        {
            caption:'celular',
            type:'numero'
        },
        {
            caption:'telefono',
            type:'numero'
        },
        {
            caption:'email',
            type:'string'
        },
        {
            caption:'calificacicon',
            type:'number'
        },
        {
            caption:'perfil',
            type:'string'
        },
        {
            caption:'numExterior',
            type:'string'
        },
        {
            caption:'numInterior',
            type:'string'
        },
        {
            caption:'calle',
            type:'string'
        },
        {
            caption:'colonia',
            type:'string'
        },
        {
            caption:'ciudad',
            type:'string'
        },
        {
            caption:'municipio',
            type:'string'
        },
        {
            caption:'estado',
            type:'string'
        },
        {
            caption:'cp',
            type:'string'
        }
        ];
	if (busqueda==null || busqueda=="")
		textoQuery = 'SELECT e.*, p.Perfil FROM TB_EMPLEADOS e, CAT_PERFILES p WHERE p.ID_Perfil = e.CAT_PERFILES_ID_Perfil ORDER BY Nombre';
	else
		textoQuery = 'SELECT e.*, p.Perfil FROM TB_EMPLEADOS e, CAT_PERFILES p WHERE (p.ID_Perfil = e.CAT_PERFILES_ID_Perfil) and ( e.Nombre LIKE "%' + busqueda + '%" OR e.Apellido_1 LIKE "%' + busqueda + '%" OR e.Apellido_2 LIKE "%' + busqueda + '%" OR e.Email LIKE "%' + busqueda + '%" ) ORDER BY e.Nombre';

	db.get().query(textoQuery, function (err, rows) {
	    if (err){
	    	response.stauts = "ERROR";
	    	res.send(JSON.stringify(response));
	  	}

	  	if ( rows && rows.length > 0){
	  		var empleados = [];
	  		var arr=[];
	  		for (var i=0; i<rows.length; i++){
	  			var empleado = new Empleado();
	  			empleado.setId(rows[i].ID_Empleado);
	  			empleado.setNombre(rows[i].Nombre);
	  			empleado.setApellido1(rows[i].Apellido_1);
	  			empleado.setApellido2(rows[i].Apellido_2);
	  			empleado.setNombreCompleto(rows[i].Nombre + " " + rows[i].Apellido_1 + " " + rows[i].Apellido_2);
	  			empleado.setNoCel(rows[i].No_Celular);
	  			empleado.setNoTel(rows[i].No_TelFijo);
	  			empleado.setEmail(rows[i].Email);
	  			empleado.setCalificacion(rows[i].Calificacion?rows[i].Calificacion:'');
	  			empleado.setNoInt(rows[i].Num_Int?rows[i].Num_Int:'');
	  			empleado.setNoExt(rows[i].Num_Ext?rows[i].Num_Ext:'');
	  			empleado.setCalle(rows[i].Calle?rows[i].Calle:'');
	  			empleado.setColonia(rows[i].Colonia?rows[i].Colonia:'');
	  			empleado.setCiudad(rows[i].Ciudad?rows[i].Ciudad:'');
	  			empleado.setMunicipio(rows[i].Municipio?rows[i].Municipio:'');
	  			empleado.setEstado(rows[i].Estado?rows[i].Estado:'');
	  			empleado.setCp(rows[i].CP?rows[i].CP:'');
	  			empleado.setPerfil(rows[i].Perfil?rows[i].Perfil:'');	
	  			a = [empleado.getId(),empleado.getNombre(),empleado.getApellido1(),empleado.getApellido2(),empleado.getNoCel(),
	  			empleado.getNoTel(),empleado.getEmail(),empleado.getCalificacion(),empleado.getPerfil(),empleado.getNoExt(),
	  			empleado.getNoInt(),empleado.getCalle(),empleado.getColonia(),empleado.getCiudad(),empleado.getMunicipio(),
	  			empleado.getEstado(),empleado.getCp()];
	  			empleados.push(empleado);
	  			arr.push(a);
	  		}
	  		conf.rows=arr;
	  		var result=nodeExcel.execute(conf);
    		res.setHeader('Content-Type','application/vnd.openxmlformats');
    		res.setHeader("Content-Disposition","attachment;filename="+"empleadosLonch.xlsx");
    		res.end(result,'binary');
		}
		else{
			response.status = "ERROR";
			res.send(JSON.stringify(response));
		}
		
	})
};

exports.getPerfiles = function(req, res) {
	var response = {status:''};

	textoQuery = 'SELECT * FROM CAT_PERFILES';

	db.get().query(textoQuery, function (err, rows) {
		console.log(textoQuery);
	    if (err){
	    	response.stauts = "ERROR";
	    	res.send(JSON.stringify(response));
	  	}

	  	if ( rows && rows.length > 0){
	  		var perfiles = [];
	  		for (var i=0; i<rows.length; i++){
	  			var perfil = new Perfil();
	  			perfil.setId(rows[i].ID_Perfil);
	  			perfil.setPerfil(rows[i].Perfil);
	  			perfil.setDescripcion(rows[i].Descripcion);
	  			perfiles.push(perfil);
	  		}

		    response.status = "SUCCESS";
		    response.data = perfiles;
		}
		else{
			response.status = "ERROR";
		}
		res.send(JSON.stringify(response));
	})
};

exports.agregaPerfil = function(req,res){
	var empleadoIndex = req.body.empleadoIndex;
    var email = req.body.email;
    var pass = req.body.pass;
    var perfil = req.body.perfil;

    var response = {status:''};

    console.log("admins.js + " + empleadoIndex);

    db.agregaPerfil(empleadoIndex, email, pass, perfil, function(err) {
		if (err)
			response.status = "ERROR";
		else
			response.status = "SUCCESS";

		res.send(JSON.stringify(response));
	});
};

exports.getNumCarta = function(req, res) {
	var response = {status:''};
	var busqueda = req.body.busqueda;
	var textoQuery = "";

	if (busqueda==null || busqueda=="")
		textoQuery = 'SELECT COUNT(1) AS num FROM CAT_MENU';
	else
		textoQuery = 'SELECT COUNT(1) AS num FROM CAT_MENU WHERE Producto LIKE "%' + busqueda + '%" OR Descripcion LIKE "%' + busqueda + '%"';
	
	db.get().query(textoQuery, function (err, rows) {
		console.log(textoQuery);
	    if (err){
	    	response.stauts = "ERROR";
	    	res.send(JSON.stringify(response));
	  	}

	  	if ( rows && rows.length > 0){
	  		response.status = "SUCCESS";
		    response.cantidad = rows[0].num;
		}
		else{
			response.status = "ERROR";
		}
		res.send(JSON.stringify(response));
	})
};

exports.getCarta = function(req, res) {
	var inicio = req.body.inicio;
	var fin = req.body.fin;
	var busqueda = req.body.busqueda;
	var response = {status:''};
	var textoQuery = "";

	if (busqueda==null || busqueda=="")
		textoQuery = 'SELECT m.ID_Producto, m.Producto, m.Costo, m.Descripcion, m.Foto, c.Descripcion as "Categoria" FROM CAT_MENU m, CAT_CATEGORIAS_MENU c WHERE m.Categoria = c.id ORDER BY Producto LIMIT ' + inicio + ', ' + fin;
	else
		textoQuery = 'SELECT m.ID_Producto, m.Producto, m.Costo, m.Descripcion, m.Foto, c.Descripcion as "Categoria" FROM CAT_MENU m, CAT_CATEGORIAS_MENU c WHERE (m.Categoria = c.id) and ( m.Producto LIKE "%' + busqueda + '%" OR m.Descripcion LIKE "%' + busqueda + '%" ) ORDER BY m.Producto LIMIT ' + inicio + ', ' + fin;

	db.get().query(textoQuery, function (err, rows) {
		console.log(textoQuery);
	    if (err){
	    	response.stauts = "ERROR";
	    	res.send(JSON.stringify(response));
	  	}

	  	if ( rows && rows.length > 0){
	  		var carta = [];
	  		for (var i=0; i<rows.length; i++){
	  			var platillo = new Platillo();
	  			platillo.setId(rows[i].ID_Producto);
	  			platillo.setProducto(rows[i].Producto);
	  			platillo.setCosto(rows[i].Costo);
	  			platillo.setDescripcion(rows[i].Descripcion);
	  			platillo.setFoto(rows[i].Foto);
	  			platillo.setCategoria(rows[i].Categoria);
	  			
	  			carta.push(platillo);
	  		}

		    response.status = "SUCCESS";
		    response.data = carta;
		}
		else{
			response.status = "ERROR";
		}
		res.send(JSON.stringify(response));
	})
};

exports.getCategorias = function(req, res) {
	var response = {status:''};

	textoQuery = 'SELECT * FROM CAT_CATEGORIAS_MENU';

	db.get().query(textoQuery, function (err, rows) {
		console.log(textoQuery);
	    if (err){
	    	response.stauts = "ERROR";
	    	res.send(JSON.stringify(response));
	  	}

	  	if ( rows && rows.length > 0){
	  		var categorias = [];
	  		for (var i=0; i<rows.length; i++){
	  			var categoria = new Categoria();
	  			categoria.setId(rows[i].id);
	  			categoria.setNombre(rows[i].Nombre);
	  			categoria.setDescripcion(rows[i].Descripcion);
	  			categorias.push(categoria);
	  		}

		    response.status = "SUCCESS";
		    response.data = categorias;
		}
		else{
			response.status = "ERROR";
		}
		res.send(JSON.stringify(response));
	})
};

exports.agregaCarta = function(cartaIndex, platillo, descripcion, costo, categoria, filenameString){
    db.agregaCarta(cartaIndex, platillo, descripcion, costo, categoria, filenameString, function(err) {
		if (err)
			return false;
		else
			return true;
	});
};

exports.eliminaCarta = function(req,res){
	var carta = req.body.carta;
	var response = {status:''};

    db.eliminaCarta(carta, function(err) {
		if (err)
			response.status = "ERROR";
		else
			response.status = "SUCCESS";

		res.send(JSON.stringify(response));
	});
};

exports.exportaCarta = function(req, res) {
	var busqueda = req.query.busqueda;	
	var response = {status:''};
	var textoQuery = "";
    var conf={}
    conf.cols=[{
            caption:'id',
            type:'number'
        },
        {
            caption:'nombre',
            type:'string'
        },
        {
            caption:'costo',
            type:'number'
        },
        {
            caption:'descripcion',
            type:'string'
        },
        {
            caption:'categoria',
            type:'string'
        }
        ];
	if (busqueda==null || busqueda==undefined || busqueda=="")
		textoQuery = 'SELECT m.*, c.Nombre FROM CAT_MENU m, CAT_CATEGORIAS_MENU c WHERE m.Categoria = c.id ORDER BY Producto';
	else
		textoQuery = 'SELECT m.*, c.Nombre FROM CAT_MENU m, CAT_CATEGORIAS_MENU c WHERE m.Categoria = c.id ORDER BY Producto';

	db.get().query(textoQuery, function (err, rows) {
	    if (err){
	    	response.stauts = "ERROR";
	    	res.send(JSON.stringify(response));
	  	}

	  	if ( rows && rows.length > 0){
	  		var platillos = [];
	  		var arr=[];
	  		for (var i=0; i<rows.length; i++){
	  			var platillo = new Platillo();
	  			platillo.setId(rows[i].ID_Producto);
	  			platillo.setProducto(rows[i].Producto);
	  			platillo.setCosto(rows[i].Costo);
	  			platillo.setDescripcion(rows[i].Descripcion);
	  			platillo.setCategoria(rows[i].Nombre);

	  			a = [platillo.getId(),platillo.getProducto(),platillo.getCosto(),platillo.getDescripcion(),platillo.getCategoria()];
	  			platillos.push(platillo);
	  			arr.push(a);
	  		}
	  		conf.rows=arr;
	  		var result=nodeExcel.execute(conf);
    		res.setHeader('Content-Type','application/vnd.openxmlformats');
    		res.setHeader("Content-Disposition","attachment;filename="+"cartaLonch.xlsx");
    		res.end(result,'binary');
		}
		else{
			response.status = "ERROR";
			res.send(JSON.stringify(response));
		}
		
	})
};

exports.getNumPlatillos = function(req, res) {
	var response = {status:''};
	var busqueda = req.body.busqueda;
	var textoQuery = "";

	if (busqueda==null || busqueda=="")
		textoQuery = 'SELECT COUNT(1) AS num FROM TB_FOODLISTS_MENU';
	else
		textoQuery = 'SELECT COUNT(1) AS num FROM TB_FOODLISTS_MENU WHERE Nombre LIKE "%' + busqueda + '%" OR Descripcion LIKE "%' + busqueda + '%"';
	
	db.get().query(textoQuery, function (err, rows) {
		console.log(textoQuery);
	    if (err){
	    	response.stauts = "ERROR";
	    	res.send(JSON.stringify(response));
	  	}

	  	if ( rows && rows.length > 0){
	  		response.status = "SUCCESS";
		    response.cantidad = rows[0].num;
		}
		else{
			response.status = "ERROR";
		}
		res.send(JSON.stringify(response));
	})
};

exports.getPlatillos = function(req, res) {
	var inicio = req.body.inicio;
	var fin = req.body.fin;
	var busqueda = req.body.busqueda;
	var response = {status:''};
	var textoQuery = "";

	if (busqueda==null || busqueda=="")
		textoQuery = 'SELECT * FROM TB_FOODLISTS_MENU ORDER BY Nombre LIMIT ' + inicio + ', ' + fin;
	else
		textoQuery = 'SELECT * FROM TB_FOODLISTS_MENU WHERE Nombre LIKE "%' + busqueda + '%" OR Descripcion LIKE "%' + busqueda + '%" ORDER BY Nombre LIMIT ' + inicio + ', ' + fin;

	db.get().query(textoQuery, function (err, rows) {
		console.log(textoQuery);
	    if (err){
	    	response.stauts = "ERROR";
	    	res.send(JSON.stringify(response));
	  	}

	  	if ( rows && rows.length > 0){
	  		var carta = [];
	  		for (var i=0; i<rows.length; i++){
	  			var platillo = new Platillo();
	  			platillo.setId(rows[i].ID);
	  			platillo.setProducto(rows[i].Nombre);
	  			platillo.setDescripcion(rows[i].Descripcion);
	  			platillo.setFoto(rows[i].Foto);
	  			
	  			carta.push(platillo);
	  		}

		    response.status = "SUCCESS";
		    response.data = carta;
		}
		else{
			response.status = "ERROR";
		}
		res.send(JSON.stringify(response));
	})
};

exports.getNumFoodlists = function(req, res) {
	var response = {status:''};
	var busqueda = req.body.busqueda;
	var textoQuery = "";

	if (busqueda==null || busqueda=="")
		textoQuery = 'SELECT COUNT(1) AS num FROM TB_FOODLISTS';
	else
		textoQuery = 'SELECT COUNT(1) AS num FROM TB_FOODLISTS WHERE Nombre LIKE "%' + busqueda + '%" OR Descripcion LIKE "%' + busqueda + '%"';
	
	db.get().query(textoQuery, function (err, rows) {
		console.log(textoQuery);
	    if (err){
	    	response.stauts = "ERROR";
	    	res.send(JSON.stringify(response));
	  	}

	  	if ( rows && rows.length > 0){
	  		response.status = "SUCCESS";
		    response.cantidad = rows[0].num;
		}
		else{
			response.status = "ERROR";
		}
		res.send(JSON.stringify(response));
	})
};

exports.getFoodlists = function(req, res) {
	var inicio = req.body.inicio;
	var fin = req.body.fin;
	var busqueda = req.body.busqueda;
	var response = {status:''};
	var textoQuery = "";

	if (busqueda==null || busqueda=="")
		textoQuery = 'SELECT * FROM TB_FOODLISTS ORDER BY Nombre LIMIT ' + inicio + ', ' + fin;
	else
		textoQuery = 'SELECT * FROM TB_FOODLISTS WHERE Nombre LIKE "%' + busqueda + '%" OR Descripcion LIKE "%' + busqueda + '%" ORDER BY Nombre LIMIT ' + inicio + ', ' + fin;

	db.get().query(textoQuery, function (err, rows) {
		console.log(textoQuery);
	    if (err){
	    	response.stauts = "ERROR";
	    	res.send(JSON.stringify(response));
	  	}

	  	if ( rows && rows.length > 0){
	  		var carta = [];
	  		for (var i=0; i<rows.length; i++){
	  			var foodlist = new Foodlist();
	  			foodlist.setId(rows[i].ID_Foodlist);
	  			foodlist.setNombre(rows[i].Nombre);
	  			foodlist.setDescripcion(rows[i].Descripcion);
	  			foodlist.setFoto(rows[i].Foto);
	  			
	  			carta.push(foodlist);
	  		}

		    response.status = "SUCCESS";
		    response.data = carta;
		}
		else{
			response.status = "ERROR";
		}
		res.send(JSON.stringify(response));
	})
};

exports.getNumProgramacion = function(req, res) {
	var response = {status:''};
	var fechaInicio = req.body.fechaInicio;
	var fechaFin = req.body.fechaFin;
	var textoQuery = "";

	if (fechaInicio==null || fechaInicio=="")
		textoQuery = 'SELECT COUNT(1) AS num FROM TB_PROGRAMACION';
	else 
		textoQuery = 'SELECT COUNT(1) AS num FROM TB_PROGRAMACION WHERE Fecha >= "' + fechaInicio + '" AND Fecha <= "' + fehcaFin + '"';
	
	db.get().query(textoQuery, function (err, rows) {
		console.log(textoQuery);
	    if (err){
	    	response.stauts = "ERROR";
	    	res.send(JSON.stringify(response));
	  	}

	  	if ( rows && rows.length > 0){
	  		response.status = "SUCCESS";
		    response.cantidad = rows[0].num;
		}
		else{
			response.status = "ERROR";
		}
		res.send(JSON.stringify(response));
	})
};

/*exports.getProgramacion = function(req, res) {
	var inicio = req.body.inicio;
	var fin = req.body.fin;
	var fechaInicio = req.body.fechaInicio;
	var fechaFin = req.body.fechaFin;
	var response = {status:''};
	var textoQuery = "";

	if (fechaInicio==null || fechaInicio=="")
		textoQuery = 'SELECT p.ID_Foodlist, DATE_FORMAT(p.Fecha,"%d-%m-%Y") as "Fecha", p.Menu_Ids, p.Costo, f.Nombre as "foodlist" FROM TB_PROGRAMACION p, TB_FOODLISTS f WHERE p.ID_Foodlist = f.ID_Foodlist ORDER BY foodlist LIMIT ' + inicio + ', ' + fin;
	else
		textoQuery = 'SELECT p.ID_Foodlist, DATE_FORMAT(p.Fecha,"%d-%m-%Y") as "Fecha", p.Menu_Ids, p.Costo, f.Nombre as "foodlist" FROM TB_PROGRAMACION p, TB_FOODLISTS f WHERE p.ID_Foodlist = f.ID_Foodlist AND p.Fecha >= "' + fechaInicio + '" AND p.Fecha <= "' + fechaFin + '" ORDER BY foodlist LIMIT ' + inicio + ', ' + fin;

	db.get().query(textoQuery, function (err, rows) {
		console.log(textoQuery);
	    if (err){
	    	response.stauts = "ERROR";
	    	res.send(JSON.stringify(response));
	  	}

	  	if ( rows && rows.length > 0){
	  		var carta = [];
	  		for (var i=0; i<rows.length; i++){
	  			var programacion = new Programacion();
	  			programacion.setId(rows[i].ID_Foodlist);
	  			programacion.setNombre(rows[i].foodlist);
	  			programacion.setFecha(rows[i].Fecha);
	  			programacion.setCosto(rows[i].Costo);
	  			programacion.setMenuIds(rows[i].Menu_Ids);
	  			
	  			carta.push(programacion);
	  		}

		    response.status = "SUCCESS";
		    response.data = carta;
		}
		else{
			response.status = "ERROR";
		}
		res.send(JSON.stringify(response));
	})
};*/

//------------------------------------------//
//-------- CÓDIGO AGREGADO POR KAGG --------//
//------------------------------------------//
//----------------TE AMO KAGG---------------//
//------------------------------------------//

exports.getProgramacion = function(req, res) {
    var inicio = req.body.inicio;
    var fin = req.body.fin;
    var fechaInicio = req.body.fechaInicio;
    var fechaFin = req.body.fechaFin;
    var response = {status:''};
    var textoQuery = "";
    
    if (fechaInicio==null || fechaInicio=="")
        textoQuery = 'SELECT p.ID_Programacion, p.ID_Foodlist, p.ID_Platillo, DATE_FORMAT(p.Fecha,"%d-%m-%Y") as "Fecha", f.Nombre as "foodlist", f.Descripcion as "fdescripcion", l.Nombre as "platillo", l.costo, l.Descripcion as "pdescripcion" FROM TB_PROGRAMACION p, TB_FOODLISTS f, TB_PLATILLOS l WHERE p.ID_Foodlist = f.ID_Foodlist ORDER BY foodlist LIMIT ' + inicio + ', ' + fin;
    
    
    else
        textoQuery = 'SELECT p.ID_Programacion, p.ID_Foodlist, p.ID_Platillo, DATE_FORMAT(p.Fecha,"%d-%m-%Y") as "Fecha", f.Nombre as "foodlist", f.Descripcion as "fdescripcion", l.Nombre as "platillo", l.costo, l.Descripcion as "pdescripcion" FROM TB_PROGRAMACION p, TB_FOODLISTS f, TB_PLATILLOS l WHERE p.ID_Foodlist = f.ID_Foodlist AND p.Fecha >= "' + fechaInicio + '" AND p.Fecha <= "' + fechaFin + '" ORDER BY foodlist LIMIT ' + inicio + ', ' + fin;
    
    db.get().query(textoQuery, function (err, rows) {
                   console.log(textoQuery);
                   if (err){
                   response.stauts = "ERROR";
                   res.send(JSON.stringify(response));
                   }
                   
                   if ( rows && rows.length > 0){
                   var carta = [];
                   for (var i=0; i<rows.length; i++){
                   var programacion = new Programacion();
                   programacion.setId(rows[i].ID_Programacion);
                   programacion.setFoodlistIds(rows[i].ID_Foodlist);
                   programacion.setPlatilloIds(rows[i].ID_Platillo);
                   programacion.setFoodlist(rows[i].foodlist);
                   programacion.setPlatillo(rows[i].platillo);
                   programacion.setDfoodlist(rows[i].fdescripcion);
                   programacion.setDplatillo(rows[i].pdescripcion);
                   programacion.setFecha(rows[i].Fecha);
                   programacion.setCosto(rows[i].Costo);
                   
                   carta.push(programacion);
                   }
                   
                   response.status = "SUCCESS";
                   response.data = carta;
                   }
                   else{
                   response.status = "ERROR";
                   }
                   res.send(JSON.stringify(response));
                   })
};
