// Constructor
function Perfil() {
  // always initialize all instance properties
  this.id = null;
  this.perfil = null;
  this.descripcion = null;
}

//----------------SETTERS-----------------------
Perfil.prototype.setId = function(id){
  this.id = id;
}
Perfil.prototype.setPerfil = function(perfil){
  this.perfil = perfil;
}
Perfil.prototype.setDescripcion = function(descripcion){
  this.descripcion = descripcion;
}
//----------------GETTERS-----------------------
Perfil.prototype.getId = function(){
  return this.id;
}
Perfil.prototype.getPerfil = function(){
  return this.perfil;
}
Perfil.prototype.getDescripcion = function(){
  return this.descripcion;
}

// export the class
module.exports = Perfil;
