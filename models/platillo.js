// Constructor
function Platillo() {
  // always initialize all instance properties
  this.id = null;
  this.producto = null;
  this.costo = null;
  this.descripcion = null;
  this.foto = null;
  this.categoria = null;
}

//----------------SETTERS-----------------------
Platillo.prototype.setId = function(id){
  this.id = id;
}
Platillo.prototype.setProducto = function(producto){
  this.producto = producto;
}
Platillo.prototype.setCosto = function(costo){
  this.costo = costo;
}
Platillo.prototype.setDescripcion = function(descripcion){
  this.descripcion = descripcion;
}
Platillo.prototype.setFoto = function(foto){
  this.foto = foto;
}
Platillo.prototype.setCategoria = function(categoria){
  this.categoria = categoria;
}

//----------------GETTERS-----------------------
Platillo.prototype.getId = function(){
  return this.id;
}
Platillo.prototype.getProducto = function(){
  return this.producto;
}
Platillo.prototype.getCosto = function(){
  return this.costo;
}
Platillo.prototype.getDescripcion = function(){
  return this.descripcion;
}
Platillo.prototype.getFoto = function(){
  return this.foto;
}
Platillo.prototype.getCategoria = function(){
  return this.categoria;
}

// export the class
module.exports = Platillo;
