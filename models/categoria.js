// Constructor
function Categoria() {
  // always initialize all instance properties
  this.id = null;
  this.nombre = null;
  this.descripcion = null;
}

//----------------SETTERS-----------------------
Categoria.prototype.setId = function(id){
  this.id = id;
}
Categoria.prototype.setNombre = function(nombre){
  this.nombre = nombre;
}
Categoria.prototype.setDescripcion = function(descripcion){
  this.descripcion = descripcion;
}
//----------------GETTERS-----------------------
Categoria.prototype.getId = function(){
  return this.id;
}
Categoria.prototype.getNombre = function(){
  return this.nombre;
}
Categoria.prototype.getDescripcion = function(){
  return this.descripcion;
}

// export the class
module.exports = Categoria;
