// Constructor
function Footlist() {
  // always initialize all instance properties
  this.id = null;
  this.nombre = null;
  this.descripcion = null;
  this.foto = null;
}

//----------------SETTERS-----------------------
Footlist.prototype.setId = function(id){
  this.id = id;
}
Footlist.prototype.setNombre = function(nombre){
  this.nombre = nombre;
}
Footlist.prototype.setDescripcion = function(descripcion){
  this.descripcion = descripcion;
}
Footlist.prototype.setFoto = function(foto){
  this.foto = foto;
}

//----------------GETTERS-----------------------
Footlist.prototype.getId = function(){
  return this.id;
}
Footlist.prototype.getNombre = function(){
  return this.nombre;
}
Footlist.prototype.getDescripcion = function(){
  return this.descripcion;
}
Footlist.prototype.getFoto = function(){
  return this.foto;
}

// export the class
module.exports = Footlist;
