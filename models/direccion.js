// Constructor
function Direccion() {
  this.id = null;
  this.direccion = null;
  this.latitud = null;
  this.longitud = null;
  this.comentarios = null;
}

//----------------SETTERS-----------------------
Direccion.prototype.setId = function(id){
  this.id = id;
}
Direccion.prototype.setDireccion = function(direccion){
  this.direccion = direccion;
}
Direccion.prototype.setLatitud = function(latitud){
  this.latitud = latitud;
}
Direccion.prototype.setLongitud = function(longitud){
  this.longitud = longitud;
}
Direccion.prototype.setComentarios = function(comentarios){
  this.comentarios = comentarios;
}

//----------------GETTERS-----------------------
Direccion.prototype.getId = function(){
  return this.id;
}
Direccion.prototype.getDireccion = function(){
  return this.direccion;
}
Direccion.prototype.getLatitud = function(){
  return this.latitud;
}
Direccion.prototype.getLongitud = function(){
  return this.longitud;
}
Direccion.prototype.getComentarios = function(){
  return this.comentarios;
}

// export the class
module.exports = Direccion;
