var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var zonas = require('./routes/zonas');
var usuarios = require('./routes/usuarios');
var admin = require('./routes/admin');
var db = require('./db')
var formidable = require('formidable')
var multer  =   require('multer');
var filenameString = "";
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/uploads');
  },
  filename: function (req, file, callback) {
    var ext = file.originalname.split(".");
    filenameString = Math.floor((Math.random() * 1000000) + 1) + '-' + Date.now() + '.' + ext[ext.length-1];
    callback(null, filenameString);
  }
});
var upload = multer({ storage : storage}).single('foto');
var app = express();
var permissions = "";

/**************************************************************/
/**************************SETS********************************/
/**************************************************************/

app.set('env', 'development');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

/**************************************************************/
/**************************USES********************************/
/**************************************************************/

app.use( bodyParser.json() ); 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(favicon(path.join(__dirname, 'public/img', 'favicon.ico')));
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));

/**************************************************************/
/*************************MySQL********************************/
/**************************************************************/

db.connect(db.MODE_PRODUCTION, function(err) {
  if (err) {
    console.log('Unable to connect to MySQL.')
    process.exit(1)
  } 
})

/**************************************************************/
/*************************Session******************************/
/**************************************************************/

var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var sessionData = require('./session');
var sessionStore = new MySQLStore(sessionData.options);

app.use(session({
  key: 'session_cookie_name',
  secret: 'session_cookie_secret2',
  store: sessionStore,
  resave: true, 
  saveUninitialized: false,
  unset: 'destroy',
  cookie: {
    expires: false,
    maxAge: null
  },
}));

/**************************************************************/
/*********************Authentication***************************/
/**************************************************************/

app.use(function(req, res, next){
  var fullUrl = req.originalUrl;
  var nombre = req.session.nombre;
  var perfil = req.session.perfil;
  var response;

  if (fullUrl.localeCompare("/admin/dashboard.html") == 0
      || fullUrl.localeCompare("/admin/empleados.html") == 0
      || fullUrl.localeCompare("/admin/cuentasUsuario.html") == 0
      || fullUrl.localeCompare("/admin/perfiles.html") == 0
      || fullUrl.localeCompare("/admin/alacarta.html") == 0
      || fullUrl.localeCompare("/admin/foodlist.html") == 0){

            console.log("Entering authentication as admin from /dashboard");
            if (nombre == null || perfil == 'user')
              res.redirect("/admin/index.html");
            else{
              var seconds = 31536000;
              req.session.cookie.expires = new Date(Date.now() + (seconds*1000));
              next();
    }
  }
  else if (fullUrl.localeCompare("/admin/") == 0
      || fullUrl.localeCompare("/admin") == 0
      || fullUrl.localeCompare("/admin/index.html") == 0){ 

            console.log("Entering authentication as admin from /admin");
        	console.log(nombre)
        	console.log(perfil)
            if (nombre != null && perfil == 'admin'){
              req.session.cookie.expires = new Date(Date.now() + (seconds*1000));
              res.redirect("/admin/dashboard.html");
            }
            else
              next();
  }
  else if (fullUrl.localeCompare("/") == 0
    || fullUrl.localeCompare("/123456.html") == 0){ 

    console.log("Entering authentication as user");
    console.log("---nombre: " + nombre);
    console.log("--perfil: " + perfil);
    if (nombre != null && perfil == 'user'){
      var seconds = 31536000;
      req.session.cookie.expires = new Date(Date.now() + (seconds*1000));
      //res.redirect("/index.html");
      console.log("Logueado");
    }
    else
      next();
  }
  else
    next();
})

app.use(express.static(__dirname + '/public'));

/**************************************************************/
/*************************Clients******************************/
/**************************************************************/

//app.get('/zonas', zonas.all)

/*app.get('/usuarios/activeSession', function(req,res){
  var nombre = req.session.nombre;
  var response;

  if (!nombre)
    response = {status:'ERROR'};
  else{
    if (req.session.rememberMe == "false"){
      var seconds = 31536000;
      req.session.cookie.expires = new Date(Date.now() + (seconds*1000));
    }
    else{
      var minute = 604800;
      req.session.cookie.expires = new Date(Date.now() + (minute*1000));
    }
    response = {status:'SUCCESS'};
    response.data = {nombre: nombre , email: req.session.email, foto: req.session.foto};
  }
  res.send(JSON.stringify(response));
})*/

/*app.get('/usuarios/logout', function(req,res){
  if (req.session.rememberMe == "false"){
    req.session.cookie.expires = new Date(Date.now()+10000);
  }
  var response;

  if (req.session)
    response = {status:'ERROR'};
  else{
    response = {status:'SUCCESS'};
  }
  res.send(JSON.stringify(response));
})*/

/*app.get('/usuarios/forceLogout', function(req,res){
  req.session.destroy();
  var response;

  if (req.session)
    response = {status:'ERROR'};
  else{
    response = {status:'SUCCESS'};
  }
  res.send(JSON.stringify(response));
})*/

/*app.post('/usuarios', function(req,res){
  usuarios.register(req,res)
  console.log(":::::"+res);
})*/

/*app.post('/usuarios/login', function(req,res){
  usuarios.login(req,res)
  console.log(":::::"+res);
})*/

app.get('/authorization', function(req,res){
  console.log("Entering /authorization");
  var response;
  response = {status:'SUCCESS'};
  response.data = {nombre: req.session.nombre , email: req.session.email, perfil: req.session.perfil, facebook: req.session.facebook, foto: req.session.foto};
  res.send(JSON.stringify(response));
})

app.post('/register', function(req,res){
  usuarios.register(req,res);
  console.log(":::::"+res);
})

app.post('/loginFacebook', function(req,res){
  usuarios.loginFacebook(req,res);
  console.log(":::::"+res);
})

app.get('/activeSession', function(req,res){
  var nombre = req.session.nombre;
  var response;
  console.log(nombre+"-----------------------------------------------++++++++++++++++ ");
  if (nombre==undefined || nombre==null || nombre=="")
    response = {status:'NOT LOGGED'};
  else{
    req.session.cookie.expires = new Date(Date.now() + (31536000*1000));
    response = {status:'SUCCESS'};
    response.data = {nombre: nombre , email: req.session.email, foto: req.session.foto};
  }
  res.send(JSON.stringify(response));
})

/**************************************************************/
/*************************Admin********************************/
/**************************************************************/

app.get('/admin', function(req,res){
  console.log("Entering /admin/login");
  admin.login(req,res)
})

app.post('/admin/login', function(req,res){
  console.log("Entering /admin/login");
  admin.login(req,res)
})

app.get('/admin/logout', function(req,res){
  console.log("Entering /admin/logout");
  req.session.destroy();
  var response;

  if (req.session)
    response = {status:'ERROR'};
  else{
    response = {status:'SUCCESS'};
  }
  res.send(JSON.stringify(response));
})

app.get('/admin/authorization', function(req,res){
  console.log("Entering /admin/authorization");
  var response;
  response = {status:'SUCCESS'};
  response.data = {nombre: req.session.nombre , email: req.session.email, permisos: req.session.permisos, perfil: req.session.perfil};
  res.send(JSON.stringify(response));
})

app.post('/admin/empleados', function(req,res){
  if (req.session.permisos[0] == "w" || req.session.permisos[0] == "r")
    admin.getEmpleados(req,res);
  else{
    var response;
    response = {status:'ERROR'};
    response.data = {descripcion: "No tienes permisos para realizar esta acción"};
    res.send(JSON.stringify(response));
  }
  console.log(":::::"+res);
})

app.post('/admin/numEmpleados', function(req,res){
  if (req.session.permisos[0] == "w" || req.session.permisos[0] == "r")
    admin.getNumEmpleados(req,res);
  else{
    var response;
    response = {status:'ERROR'};
    response.data = {descripcion: "No tienes permisos para realizar esta acción"};
    res.send(JSON.stringify(response));
  }
  console.log(":::::"+res);
})

app.post('/admin/agregaEmpleado', function(req,res){
  if (req.session.permisos[0] == "w")
    admin.agregaEmpleado(req,res);
  else{
    var response;
    response = {status:'ERROR'};
    response.data = {descripcion: "No tienes permisos para realizar esta acción"};
    res.send(JSON.stringify(response));
  }
  console.log(":::::"+res);
})

app.post('/admin/eliminaEmpleados', function(req,res){
  if (req.session.permisos[0] == "w")
    admin.eliminaEmpleados(req,res);
  else{
    var response;
    response = {status:'ERROR'};
    response.data = {descripcion: "No tienes permisos para realizar esta acción"};
    res.send(JSON.stringify(response));
  }
  console.log(":::::"+res);
})

app.post('/admin/actualizaEmpleado', function(req,res){
  console.log("***********");
  if (req.session.permisos[0] == "w")
    admin.actualizaEmpleado(req,res);
  else{
    var response;
    response = {status:'ERROR'};
    response.data = {descripcion: "No tienes permisos para realizar esta acción"};
    res.send(JSON.stringify(response));
  }
  console.log(":::::"+res);
})

app.get('/admin/exportaEmpleados', function(req,res){
  if (req.session.permisos[0] == "w" || req.session.permisos[0] == "r")
    admin.exportaEmpleados(req,res);
  else{
    var response;
    response = {status:'ERROR'};
    response.data = {descripcion: "No tienes permisos para realizar esta acción"};
    res.send(JSON.stringify(response));
  }
  console.log(":::::"+res);
})

app.post('/admin/agregaPerfil', function(req,res){
  if (req.session.permisos[1] == "w")
    admin.agregaPerfil(req,res);
  else{
    var response;
    response = {status:'ERROR'};
    response.data = {descripcion: "No tienes permisos para realizar esta acción"};
    res.send(JSON.stringify(response));
  }
  console.log(":::::"+res);
})

app.get('/admin/perfiles', function(req,res){
  if (req.session.permisos[2] == "w" || req.session.permisos[2] == "r")
    admin.getPerfiles(req,res);
  else{
    var response;
    response = {status:'ERROR'};
    response.data = {descripcion: "No tienes permisos para realizar esta acción"};
    res.send(JSON.stringify(response));
  }
  console.log(":::::"+res);
})

app.post('/admin/numCarta', function(req,res){
  if (req.session.permisos[3] == "w" || req.session.permisos[3] == "r")
    admin.getNumCarta(req,res);
  else{
    var response;
    response = {status:'ERROR'};
    response.data = {descripcion: "No tienes permisos para realizar esta acción"};
    res.send(JSON.stringify(response));
  }
  console.log(":::::"+res);
})

app.post('/admin/carta', function(req,res){
  if (req.session.permisos[3] == "w" || req.session.permisos[3] == "r")
    admin.getCarta(req,res);
  else{
    var response;
    response = {status:'ERROR'};
    response.data = {descripcion: "No tienes permisos para realizar esta acción"};
    res.send(JSON.stringify(response));
  }
  console.log(":::::"+res);
})

app.get('/admin/categorias', function(req,res){
  if (req.session.permisos[3] == "w" || req.session.permisos[3] == "r")
    admin.getCategorias(req,res);
  else{
    var response;
    response = {status:'ERROR'};
    response.data = {descripcion: "No tienes permisos para realizar esta acción"};
    res.send(JSON.stringify(response));
  }
  console.log(":::::"+res);
})

app.post('/admin/agrega_carta',function(req,res){
  var form = new formidable.IncomingForm();
  var platillo, descripcion, costo, categoria, cartaIndex;
  var response = {status:''};

  if (req.session.permisos[3] == "w"){

    upload(req,res,function(err) {
      if(err) {
          response.status = "ERROR";
      } 
    });

    form.parse(req, function(err, fields, files) {
      cartaIndex = fields.cartaIndex;
      platillo = fields.platillo;
      descripcion = fields.descripcion;
      costo = fields.costo;
      categoria = fields.categoria;
      
      if(!admin.agregaCarta(cartaIndex, platillo, descripcion, costo, categoria, filenameString))
        response.status = "ERROR";
    });
    
    response.status = "SUCCESS";

    res.send(JSON.stringify(response));
  }
  else{
    var response;
    response = {status:'ERROR'};
    response.data = {descripcion: "No tienes permisos para realizar esta acción"};
    res.send(JSON.stringify(response));
  }
  
})

app.post('/admin/eliminaCarta', function(req,res){
  if (req.session.permisos[3] == "w")
    admin.eliminaCarta(req,res);
  else{
    var response;
    response = {status:'ERROR'};
    response.data = {descripcion: "No tienes permisos para realizar esta acción"};
    res.send(JSON.stringify(response));
  }
  console.log(":::::"+res);
})

app.get('/admin/exportaCarta', function(req,res){
  if (req.session.permisos[3] == "w")
    admin.exportaCarta(req,res);
  else{
    var response;
    response = {status:'ERROR'};
    response.data = {descripcion: "No tienes permisos para realizar esta acción"};
    res.send(JSON.stringify(response));
  }
  console.log(":::::"+res);
})

app.post('/admin/numPlatillos', function(req,res){
  if (req.session.permisos[3] == "w" || req.session.permisos[3] == "r")
    admin.getNumPlatillos(req,res);
  else{
    var response;
    response = {status:'ERROR'};
    response.data = {descripcion: "No tienes permisos para realizar esta acción"};
    res.send(JSON.stringify(response));
  }
  console.log(":::::"+res);
})

app.post('/admin/platillos', function(req,res){
  if (req.session.permisos[3] == "w" || req.session.permisos[3] == "r")
    admin.getPlatillos(req,res);
  else{
    var response;
    response = {status:'ERROR'};
    response.data = {descripcion: "No tienes permisos para realizar esta acción"};
    res.send(JSON.stringify(response));
  }
  console.log(":::::"+res);
})

app.post('/admin/numFoodlists', function(req,res){
  if (req.session.permisos[3] == "w" || req.session.permisos[3] == "r")
    admin.getNumFoodlists(req,res);
  else{
    var response;
    response = {status:'ERROR'};
    response.data = {descripcion: "No tienes permisos para realizar esta acción"};
    res.send(JSON.stringify(response));
  }
  console.log(":::::"+res);
})

app.post('/admin/foodlists', function(req,res){
  if (req.session.permisos[3] == "w" || req.session.permisos[3] == "r")
    admin.getFoodlists(req,res);
  else{
    var response;
    response = {status:'ERROR'};
    response.data = {descripcion: "No tienes permisos para realizar esta acción"};
    res.send(JSON.stringify(response));
  }
  console.log(":::::"+res);
})

app.post('/admin/numProgramacion', function(req,res){
  if (req.session.permisos[3] == "w" || req.session.permisos[3] == "r")
    admin.getNumProgramacion(req,res);
  else{
    var response;
    response = {status:'ERROR'};
    response.data = {descripcion: "No tienes permisos para realizar esta acción"};
    res.send(JSON.stringify(response));
  }
  console.log(":::::"+res);
})

app.post('/admin/programacion', function(req,res){
  if (req.session.permisos[3] == "w" || req.session.permisos[3] == "r")
    admin.getProgramacion(req,res);
  else{
    var response;
    response = {status:'ERROR'};
    response.data = {descripcion: "No tienes permisos para realizar esta acción"};
    res.send(JSON.stringify(response));
  }
  console.log(":::::"+res);
})

/*app.get('/admin/usuarios/activeSession', function(req,res){
  var fullUrl = req.originalUrl;
  var nombre = req.session.nombre;
  console.log("***********");
  console.log("URL: " + fullUrl);
  console.log(nombre);

  var response;

  if (fullUrl!="/admin/index.html" && nombre == null){
    res.writeHead(301,{Location: "/admin/index.html"});
    res.end();
  }
  else{
    var seconds = 31536000;
    req.session.cookie.expires = new Date(Date.now() + (seconds*1000));
    response = {status:'SUCCESS'};
    response.data = {nombre: nombre , email: req.session.email};
    //if (fullUrl==="/admin/index.html"){
      res.writeHead(301,{Location: "/admin/index.html"});
      res.send(JSON.stringify(response));
    //}
  }
})*/

/**************************************************************/
/*************************Error********************************/
/**************************************************************/

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

module.exports = app;
//m8r-b9qkp51@mailinator.com