var mysql = require('mysql')
  , async = require('async')

var PRODUCTION_DB = 'app_prod_database'
  , TEST_DB = 'app_test_database'

exports.MODE_TEST = 'mode_test'
exports.MODE_PRODUCTION = 'mode_production'

var state = {
  pool: null,
  mode: null,
}

exports.connect = function(mode, done) {
  state.pool = mysql.createPool({
    host: 'lonch.cjt5lkku4gno.us-west-2.rds.amazonaws.com',
    user: 'lonch_master',
    password: 'M2H5hZmb',
    port: '3306', 
    database: 'lonch'
  })

  state.mode = 'lonch'
  done()
}

exports.get = function() {
  return state.pool
}

exports.fixtures = function(data,done) {
  var pool = state.pool
  if (!pool) return done(new Error('Missing database connection.'))

  var names = Object.keys(data.tables)
  async.each(names, function(name, cb) {
    async.each(data.tables[name], function(row, cb) {
      var keys = Object.keys(row)
        , values = keys.map(function(key) { return "'" + row[key] + "'" })
        console.log('INSERT INTO ' + name + ' (' + keys.join(',') + ') VALUES (' + values.join(',') + ')');
      pool.query('INSERT INTO ' + name + ' (' + keys.join(',') + ') VALUES (' + values.join(',') + ')', cb)
    }, cb)
  }, done)
}

exports.registerUserFirstTime = function(name,ap,email,phone,password,photo,done){
  var pool = state.pool
  if (!pool) return done(new Error('Missing database connection.'))

  console.log('INSERT INTO TB_CLIENTES (Nombre,Apellido_1,Email,No_Celular,Password,Foto) VALUES (\'' + name + '\',\'' + ap + '\',\'' + email + '\',' + phone + 
    ',\'' + password + '\',\'' + photo + '\')');
  pool.query('INSERT INTO TB_CLIENTES (Nombre,Apellido_1,Email,No_Celular,Password,Foto) VALUES (\'' + name + '\',\'' + ap + '\',\'' + email + '\',' + phone + 
    ',\'' + password + '\',\'' + photo + '\')');

  done();
}

exports.agregaEmpleado = function(nombre,appaterno,apmaterno,email,celular,telefono,calle,noExterior,noInterior,colonia,ciudad,municipio,estado,cp,done){
  var pool = state.pool
  if (!pool) return done(new Error('Missing database connection.'))

  console.log('INSERT INTO TB_EMPLEADOS (Nombre,Apellido_1,Apellido_2,Email,No_Celular,No_TelFijo,Calle,Num_Ext,Num_Int,Colonia,Ciudad,Municipio,Estado,CP,Timestamp) VALUES (\'' + nombre + '\',\'' + appaterno + '\',' + 
    '\'' + apmaterno + '\',\'' + email + '\',' + celular + ',' + telefono + ',\'' + calle + '\',' + noExterior + ',' + noInterior + ',\'' + colonia + '\',\'' + ciudad + '\',\'' + municipio + '\',\'' + estado + '\',\'' + cp + '\',NOW())');
  /*
  ppol.getConnection(function (err,connection){
    connection.query('INSERT INTO TB_DIRECCION (Num_Ext,Num_Int,Calle,Colonia,Ciudad,Municipio)',function(err,result){
      connection.query('INSERT INTO TB_EMPLEADOS'+result.inserId);
      connection.release();
    });
  });
  */
  pool.query('INSERT INTO TB_EMPLEADOS (Nombre,Apellido_1,Apellido_2,Email,No_Celular,No_TelFijo,Calle,Num_Ext,Num_Int,Colonia,Ciudad,Municipio,Estado,CP,Timestamp) VALUES (\'' + nombre + '\',\'' + appaterno + '\',' + 
    '\'' + apmaterno + '\',\'' + email + '\',\'' + celular + '\',\'' + telefono + '\',\'' + calle + '\',' + noExterior + ',' + noInterior + ',\'' + colonia + '\',\'' + ciudad + '\',\'' + municipio + '\',\'' + estado + '\',\'' + cp + '\',NOW())');
  done();
}

exports.actualizaEmpleado = function(idEmpleado,nombre,appaterno,apmaterno,email,celular,telefono,calle,noExterior,noInterior,colonia,ciudad,municipio,estado,cp,done){
  var pool = state.pool
  if (!pool) return done(new Error('Missing database connection.'))

  console.log('UPDATE TB_EMPLEADOS SET Nombre=\''+nombre+'\',Apellido_1=\''+appaterno+'\',Apellido_2=\''+apmaterno+'\',No_Celular='+celular+',No_TelFijo='+telefono+',Email=\''+email+'\',Calle=\''+calle+'\',Num_Ext='+noExterior+',Num_Int='+noInterior+',Colonia=\''+colonia+'\',Ciudad=\''+ciudad+'\',Municipio=\''+municipio+'\',Estado=\''+estado+'\',CP=\''+cp+'\',Timestamp=NOW() WHERE ID_Empleado = '+idEmpleado);
  pool.query('UPDATE TB_EMPLEADOS SET Nombre=\''+nombre+'\',Apellido_1=\''+appaterno+'\',Apellido_2=\''+apmaterno+'\',No_Celular=\''+celular+'\',No_TelFijo=\''+telefono+'\',Email=\''+email+'\',Calle=\''+calle+'\',Num_Ext='+noExterior+',Num_Int='+noInterior+',Colonia=\''+colonia+'\',Ciudad=\''+ciudad+'\',Municipio=\''+municipio+'\',Estado=\''+estado+'\',CP=\''+cp+'\',Timestamp=NOW() WHERE ID_Empleado = '+idEmpleado);
  done();
}


exports.eliminaEmpleados = function(empleados,done){
  var pool = state.pool
  if (!pool) return done(new Error('Missing database connection.'))

 /* var elements = "(";
  for(var i=0; i<empelados.length; i++){
    elements +=  elements[i] + ",";
  }
  elements[elements.lentgh-1] = ")";*/

  console.log('DELETE FROM TB_EMPLEADOS WHERE ID_Empleado IN ' + empleados);
  pool.query('DELETE FROM TB_EMPLEADOS WHERE ID_Empleado IN ' + empleados);

  done();
}

exports.drop = function(tables, done) {
  var pool = state.pool
  if (!pool) return done(new Error('Missing database connection.'))

  async.each(tables, function(name, cb) {
    pool.query('DELETE * FROM ' + name, cb)
  }, done)
}

exports.agregaPerfil = function(empleadoIndex, email, pass, perfil,done){
  var pool = state.pool
  if (!pool) return done(new Error('Missing database connection.'))
  console.log("db.js + " + empleadoIndex);
  if (pass != "secreto"){
    console.log("UPDATE TB_EMPLEADOS SET Password='" + pass + "',CAT_PERFILES_ID_Perfil=" + perfil + " WHERE ID_Empleado = " + empleadoIndex);
    pool.query("UPDATE TB_EMPLEADOS SET Password='" + pass + "',CAT_PERFILES_ID_Perfil=" + perfil + " WHERE ID_Empleado = " + empleadoIndex);
  }
  else{
    console.log("UPDATE TB_EMPLEADOS SET CAT_PERFILES_ID_Perfil=" + perfil + " WHERE ID_Empleado = " + empleadoIndex);
    pool.query("UPDATE TB_EMPLEADOS SET CAT_PERFILES_ID_Perfil=" + perfil + " WHERE ID_Empleado = " + empleadoIndex);
  }
  done();
}

exports.agregaCarta = function(cartaIndex, platillo, descripcion, costo, categoria, filenameString,done){
  var pool = state.pool
  if (!pool) return done(new Error('Missing database connection.'))

  if (cartaIndex != null && cartaIndex != undefined && cartaIndex != "undefined" && cartaIndex != ""){
    if (filenameString != null && filenameString != undefined && filenameString != "undefined" && filenameString != ""){
      console.log("UPDATE CAT_MENU SET Producto='"+platillo+"',Costo="+costo+",Descripcion='"+descripcion+"',Foto='"+filenameString+"',Categoria="+categoria+",Timestamp=NOW() WHERE ID_Producto="+cartaIndex+";");
      pool.query("UPDATE CAT_MENU SET Producto='"+platillo+"',Costo="+costo+",Descripcion='"+descripcion+"',Foto='"+filenameString+"',Categoria="+categoria+",Timestamp=NOW() WHERE ID_Producto="+cartaIndex+";");
    }
    else{
      console.log("UPDATE CAT_MENU SET Producto='"+platillo+"',Costo="+costo+",Descripcion='"+descripcion+"',Categoria="+categoria+",Timestamp=NOW() WHERE ID_Producto="+cartaIndex+";");
      pool.query("UPDATE CAT_MENU SET Producto='"+platillo+"',Costo="+costo+",Descripcion='"+descripcion+"',Categoria="+categoria+",Timestamp=NOW() WHERE ID_Producto="+cartaIndex+";");
    }
  }
  else{
    console.log("INSERT INTO CAT_MENU (Producto, Costo, Descripcion, Foto, Categoria, Timestamp) VALUES ('"+platillo+"',"+costo+",'"+descripcion+"','"+filenameString+"',"+categoria+",NOW());");
    pool.query("INSERT INTO CAT_MENU (Producto, Costo, Descripcion, Foto, Categoria, Timestamp) VALUES ('"+platillo+"',"+costo+",'"+descripcion+"','"+filenameString+"',"+categoria+",NOW());");
  }

  done();
}

exports.eliminaCarta = function(carta,done){
  var pool = state.pool
  if (!pool) return done(new Error('Missing database connection.'))

  console.log('DELETE FROM CAT_MENU WHERE ID_Producto IN ' + carta);
  pool.query('DELETE FROM CAT_MENU WHERE ID_Producto IN ' + carta);

  done();
}
