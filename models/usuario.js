// Constructor
function Usuario() {
  // always initialize all instance properties
  this.id = null;
  this.nombre = null;
  this.apellido1 = null;
  this.apellido2 = null;
  this.fechaNac = null;
  this.genero = null;
  this.noCel = null;
  this.noTel = null;
  this.ext = null;
  this.email = null;
  this.password = null;
  this.rememberMe = null;
  this.foto = null;
  this.facebook = null;
}

//----------------SETTERS-----------------------
Usuario.prototype.setId = function(id){
  this.id = id;
}
Usuario.prototype.setNombre = function(nombre){
  this.nombre = nombre;
}
Usuario.prototype.setApellido1 = function(apellido1){
  this.apellido1 = apellido1;
}
Usuario.prototype.setApellido2 = function(apellido2){
  this.apellido2 = apellido2;
}
Usuario.prototype.setFechaNac = function(fechaNac){
  this.fechaNac = fechaNac;
}
Usuario.prototype.setGenero = function(genero){
  this.genero = genero;
}
Usuario.prototype.setNoCel = function(noCel){
  this.noCel = noCel;
}
Usuario.prototype.setNoTel = function(noTel){
  this.noTel = noTel;
}
Usuario.prototype.setExt = function(ext){
  this.ext = ext;
}
Usuario.prototype.setEmail = function(email){
  this.email = email;
}
Usuario.prototype.setPassword = function(password){
  this.password = password;
}
Usuario.prototype.setRememberMe = function(rememberMe){
  this.rememberMe = rememberMe;
}
Usuario.prototype.setFoto = function(foto){
  this.foto = foto;
}
Usuario.prototype.setFacebook = function(facebook){
  this.facebook = facebook;
}

//----------------GETTERS-----------------------
Usuario.prototype.getId = function(){
  return this.id;
}
Usuario.prototype.getNombre = function(){
  return this.nombre;
}
Usuario.prototype.getApellido1 = function(){
  return this.apellido1;
}
Usuario.prototype.getApellido2 = function(){
  return this.apellido2;
}
Usuario.prototype.getFechaNac = function(){
  return this.fechaNac;
}
Usuario.prototype.getGenero = function(){
  return this.genero;
}
Usuario.prototype.getNoCel = function(){
  return this.noCel;
}
Usuario.prototype.getNoTel = function(){
  return this.noTel;
}
Usuario.prototype.getExt = function(){
  return this.ext;
}
Usuario.prototype.getEmail = function(){
  return this.email;
}
Usuario.prototype.getPassword = function(){
  return this.password;
}
Usuario.prototype.getRememberMe = function(){
  return this.rememberMe;
}
Usuario.prototype.getFoto = function(){
  return this.foto;
}
Usuario.prototype.getFacebook = function(){
  return this.facebook;
}

// export the class
module.exports = Usuario;
