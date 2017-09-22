// Constructor
function Empleado() {
  // always initialize all instance properties
  this.id = null;
  this.nombre = null;
  this.apellido1 = null;
  this.apellido2 = null;
  this.nombreCompleto = null;
  this.noCel = null;
  this.noTel = null;
  this.email = null;
  this.password = null;
  this.calificacion = null;
  this.noExt = null;
  this.noInt = null;
  this.calle = null;
  this.colonia = null;
  this.ciudad = null;
  this.municipio = null;
  this.estado = null;
  this.cp = null;
  this.perfil = null;
  this.permisos = null;
}

//----------------SETTERS-----------------------
Empleado.prototype.setId = function(id){
  this.id = id;
}
Empleado.prototype.setNombre = function(nombre){
  this.nombre = nombre;
}
Empleado.prototype.setApellido1 = function(apellido1){
  this.apellido1 = apellido1;
}
Empleado.prototype.setApellido2 = function(apellido2){
  this.apellido2 = apellido2;
}
Empleado.prototype.setNombreCompleto = function(nombreCompleto){
  this.nombreCompleto = nombreCompleto;
}
Empleado.prototype.setNoCel = function(noCel){
  this.noCel = noCel;
}
Empleado.prototype.setNoTel = function(noTel){
  this.noTel = noTel;
}
Empleado.prototype.setEmail = function(email){
  this.email = email;
}
Empleado.prototype.setPassword = function(password){
  this.password = password;
}
Empleado.prototype.setCalificacion = function(calificacion){
  this.calificacion = calificacion;
}
Empleado.prototype.setNoExt = function(noExt){
  this.noExt = noExt;
}
Empleado.prototype.setNoInt = function(noInt){
  this.noInt = noInt;
}
Empleado.prototype.setCalle = function(calle){
  this.calle = calle;
}
Empleado.prototype.setColonia = function(colonia){
  this.colonia = colonia;
}
Empleado.prototype.setCiudad = function(ciudad){
  this.ciudad = ciudad;
}
Empleado.prototype.setMunicipio = function(municipio){
  this.municipio = municipio;
}
Empleado.prototype.setEstado = function(estado){
  this.estado = estado;
}
Empleado.prototype.setCp = function(cp){
  this.cp = cp;
}
Empleado.prototype.setPerfil = function(perfil){
  this.perfil = perfil;
}
Empleado.prototype.setPermisos = function(permisos){
  this.permisos = permisos;
}

//----------------GETTERS-----------------------
Empleado.prototype.getId = function(){
  return this.id;
}
Empleado.prototype.getNombre = function(){
  return this.nombre;
}
Empleado.prototype.getApellido1 = function(){
  return this.apellido1;
}
Empleado.prototype.getApellido2 = function(){
  return this.apellido2;
}
Empleado.prototype.getNombreCompleto = function(){
  return this.nombreCompleto;
}
Empleado.prototype.getNoCel = function(){
  return this.noCel;
}
Empleado.prototype.getNoTel = function(){
  return this.noTel;
}
Empleado.prototype.getEmail = function(){
  return this.email;
}
Empleado.prototype.getPassword = function(){
  return this.password;
}
Empleado.prototype.getCalificacion = function(){
  return this.calificacion;
}
Empleado.prototype.getNoExt = function(){
  return this.noExt;
}
Empleado.prototype.getNoInt = function(){
  return this.noInt;
}
Empleado.prototype.getCalle = function(){
  return this.calle;
}
Empleado.prototype.getColonia = function(){
  return this.colonia;
}
Empleado.prototype.getCiudad = function(){
  return this.ciudad;
}
Empleado.prototype.getMunicipio = function(){
  return this.municipio;
}
Empleado.prototype.getEstado = function(){
  return this.estado;
}
Empleado.prototype.getCp = function(){
  return this.cp;
}
Empleado.prototype.getPerfil = function(){
  return this.perfil;
}
Empleado.prototype.getPermisos = function(){
  return this.permisos;
}

// export the class
module.exports = Empleado;
