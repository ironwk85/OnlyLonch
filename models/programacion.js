// Constructor
function Programacion() {
  // always initialize all instance properties
  this.id = null;
  this.nombre = null;
  this.fecha = null;
  this.costo = null;
  this.menuIds = null;
  this.platillos = null;
}

//----------------SETTERS-----------------------
Programacion.prototype.setId = function(id){
  this.id = id;
}
Programacion.prototype.setNombre = function(nombre){
  this.nombre = nombre;
}
Programacion.prototype.setFecha = function(fecha){
  this.fecha = fecha;
}
Programacion.prototype.setCosto = function(costo){
  this.costo = costo;
}
Programacion.prototype.setMenuIds = function(menuIds){
  this.menuIds = menuIds;
}
Programacion.prototype.setPlatillos = function(platillos){
  this.platillos = platillos;
}

//----------------GETTERS-----------------------
Programacion.prototype.getId = function(){
  return this.id;
}
Programacion.prototype.getNombre = function(){
  return this.nombre;
}
Programacion.prototype.getFecha = function(){
  return this.fecha;
}
Programacion.prototype.getCosto = function(){
  return this.costo;
}
Programacion.prototype.getMenuIds = function(){
  return this.menuIds;
}
Programacion.prototype.getPlatillos = function(){
  return this.platillos;
}

// export the class
module.exports = Programacion;
