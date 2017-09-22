$(document).ready(function(){
    $.ajax({
       type: "GET",
       url: './authorization',
       dataType: 'json',
       success: function (json) {
            var permisos = json.data.permisos;

            permisoLocal = permisos[3];
            if (permisos[0] == 'w' || permisos[0] == 'r')
                $('#empleados_li').show();
            if (permisos[1] == 'w' || permisos[1] == 'r')
                $('#cuentasUsuario_li').show();
            if (permisos[2] == 'w' || permisos[2] == 'r')
                $('#perfiles_li').show();
            if (permisos[3] == 'w' || permisos[3] == 'r'){
                $('#menu_li').show();
                $('#carta_li').show();
            }
        },
        complete: function (){
            getNumProgramacion("");
            getProgramacion("");
        }
   }); 
});

function getNumPlatillos(busqueda){
    var sendInfo = {
        busqueda: busqueda
    };

    $.ajax({
        type: "POST",
        url: './numPlatillos',
        dataType: 'json',
        
        beforeSend: function(){
        },
        success: function(json) {
            if (json.status == "SUCCESS"){
                $("#cuenta").val(json.cantidad);
                $('#cuenta b').text('Registro del 1 al 5 de ' + json.cantidad);
            }
            else{
                //DO-NOTHING
            }
        },
        data: sendInfo
    }); 
}

function getPlatillos(busqueda){
    var inicio = $("#inicio").val();
    var fin = $("#fin").val();
    var sendInfo = {
      inicio: inicio,
      fin: fin,
      busqueda: busqueda
    };

    $.ajax({
        type: "POST",
        url: './platillos',
        dataType: 'json',
        
        beforeSend: function(){
            $(loading).toggleClass('loadingSDialog-after');
        },
        success: function(json) {
            if (json.status == "SUCCESS"){
                var $tr = '';
                $("#tablaPlatillos tbody").empty();
                $.each(json.data, function(i, item) {
                    $tr = $('<tr>').append(
                        $('<td>').text(item.producto),
                        $('<td>').text(item.descripcion),
                        $('<td id="editar" style="display:none;" align="center">').html('<a href="#" onclick="limpiarForma();editarForma('+item.id+',\''+item.producto+'\','+item.costo+',\''+item.descripcion+'\',\''+item.foto+'\',\''+item.categoria+'\');" class="fa fa-edit" style="font-size:25px;color:#000000" data-toggle="modal" data-target="#myModal"></a>'),
                        $('<td id="editar" style="display:none;" align="center">').html('<a href="#" onclick="eliminaCarta('+item.id+');" class="fa fa-trash-o" style="font-size:25px;color:#000000"></a>'),
                        $('<td id="ver" style="display:none;" align="center">').html('<a href="#" onclick="limpiarForma();verForma('+item.id+',\''+item.producto+'\','+item.costo+',\''+item.descripcion+'\',\''+item.foto+'\',\''+item.categoria+'\');" class="fa fa-sticky-note-o" style="font-size:25px;color:#000000" data-toggle="modal" data-target="#myModal"></a>'),
                        $('<td id="editar" style="display:none;"  align="center">').html('<input id="eliminarCheckbox" type="checkbox"><input value="' + item.id + '" type="hidden"> </td>')
                    );
                    $('#tablaPlatillos tbody').append($tr);
                });
            }
            else{
                $("#tablaPlatillos tbody").empty();
            }
            $(loading).toggleClass('loadingSDialog-after');
        },
        complete: function(){
           if (permisoLocal == "w"){
                $('#agregar_registro').show();
                $('#eliminar_registros').show();
                $('#tablaPlatillos tbody tr #editar').show();
                $('#tablaPlatillos thead tr #editar').show();
            }
            else if (permisoLocal == "r"){
                $('#tablaPlatillos thead tr #ver').show();
                $('#tablaPlatillos tbody tr #ver').show();
            }
        },
        data: sendInfo
    });
}

function getNumFoodlists(busqueda){
    var sendInfo = {
        busqueda: busqueda
    };

    $.ajax({
        type: "POST",
        url: './numFoodlists',
        dataType: 'json',
        
        beforeSend: function(){
        },
        success: function(json) {
            if (json.status == "SUCCESS"){
                $("#cuenta").val(json.cantidad);
                $('#cuenta b').text('Registro del 1 al 5 de ' + json.cantidad);
            }
            else{
                //DO-NOTHING
            }
        },
        data: sendInfo
    }); 
}

function getFoodlists(busqueda){
    var inicio = $("#inicio").val();
    var fin = $("#fin").val();
    var sendInfo = {
      inicio: inicio,
      fin: fin,
      busqueda: busqueda
    };

    $.ajax({
        type: "POST",
        url: './foodlists',
        dataType: 'json',
        
        beforeSend: function(){
            $(loading).toggleClass('loadingSDialog-after');
        },
        success: function(json) {
            if (json.status == "SUCCESS"){
                var $tr = '';
                $("#tablaFoodlists tbody").empty();
                $.each(json.data, function(i, item) {
                    $tr = $('<tr>').append(
                        $('<td>').text(item.nombre),
                        $('<td>').text(item.descripcion),
                        $('<td id="editar" style="display:none;" align="center">').html('<a href="#" onclick="limpiarForma();editarForma('+item.id+',\''+item.producto+'\','+item.costo+',\''+item.descripcion+'\',\''+item.foto+'\',\''+item.categoria+'\');" class="fa fa-edit" style="font-size:25px;color:#000000" data-toggle="modal" data-target="#myModal"></a>'),
                        $('<td id="editar" style="display:none;" align="center">').html('<a href="#" onclick="eliminaCarta('+item.id+');" class="fa fa-trash-o" style="font-size:25px;color:#000000"></a>'),
                        $('<td id="ver" style="display:none;" align="center">').html('<a href="#" onclick="limpiarForma();verForma('+item.id+',\''+item.producto+'\','+item.costo+',\''+item.descripcion+'\',\''+item.foto+'\',\''+item.categoria+'\');" class="fa fa-sticky-note-o" style="font-size:25px;color:#000000" data-toggle="modal" data-target="#myModal"></a>'),
                        $('<td id="editar" style="display:none;"  align="center">').html('<input id="eliminarCheckbox" type="checkbox"><input value="' + item.id + '" type="hidden"> </td>')
                    );
                    $('#tablaFoodlists tbody').append($tr);
                });
            }
            else{
                $("#tablaFoodlists tbody").empty();
            }
            $(loading).toggleClass('loadingSDialog-after');
        },
        complete: function(){
           if (permisoLocal == "w"){
                $('#agregar_registro').show();
                $('#eliminar_registros').show();
                $('#tablaFoodlists tbody tr #editar').show();
                $('#tablaFoodlists thead tr #editar').show();
            }
            else if (permisoLocal == "r"){
                $('#tablaFoodlists thead tr #ver').show();
                $('#tablaFoodlists tbody tr #ver').show();
            }
        },
        data: sendInfo
    });
}

function getNumProgramacion(busqueda){
    var sendInfo = {
        busqueda: busqueda
    };

    $.ajax({
        type: "POST",
        url: './numProgramacion',
        dataType: 'json',
        
        beforeSend: function(){
        },
        success: function(json) {
            if (json.status == "SUCCESS"){
                $("#cuenta").val(json.cantidad);
                $('#cuenta b').text('Registro del 1 al 5 de ' + json.cantidad);
            }
            else{
                //DO-NOTHING
            }
        },
        data: sendInfo
    }); 
}

function getProgramacion(busqueda){
    var inicio = $("#inicio").val();
    var fin = $("#fin").val();
    var sendInfo = {
      inicio: inicio,
      fin: fin,
      busqueda: busqueda
    };

    $.ajax({
        type: "POST",
        url: './programacion',
        dataType: 'json',
        
        beforeSend: function(){
            $(loading).toggleClass('loadingSDialog-after');
        },
        success: function(json) {
            if (json.status == "SUCCESS"){
                var $tr = '';
                $("#tablaProgramacion tbody").empty();
                $.each(json.data, function(i, item) {
                    $tr = $('<tr>').append(
                        $('<td>').text(item.fecha),
                        $('<td>').text(item.nombre),
                        $('<td>').text(item.costo),
                        $('<td id="editar" style="display:none;" align="center">').html('<a href="#" onclick="limpiarForma();editarForma('+item.id+',\''+item.producto+'\','+item.costo+',\''+item.descripcion+'\',\''+item.foto+'\',\''+item.categoria+'\');" class="fa fa-edit" style="font-size:25px;color:#000000" data-toggle="modal" data-target="#myModal"></a>'),
                        $('<td id="editar" style="display:none;" align="center">').html('<a href="#" onclick="eliminaCarta('+item.id+');" class="fa fa-trash-o" style="font-size:25px;color:#000000"></a>'),
                        $('<td id="ver" style="display:none;" align="center">').html('<a href="#" onclick="limpiarForma();verForma('+item.id+',\''+item.producto+'\','+item.costo+',\''+item.descripcion+'\',\''+item.foto+'\',\''+item.categoria+'\');" class="fa fa-sticky-note-o" style="font-size:25px;color:#000000" data-toggle="modal" data-target="#myModal"></a>'),
                        $('<td id="editar" style="display:none;"  align="center">').html('<input id="eliminarCheckbox" type="checkbox"><input value="' + item.id + '" type="hidden"> </td>')
                    );
                    $('#tablaProgramacion tbody').append($tr);
                });
            }
            else{
                $("#tablaProgramacion tbody").empty();
            }
            $(loading).toggleClass('loadingSDialog-after');
        },
        complete: function(){
           if (permisoLocal == "w"){
                $('#agregar_registro').show();
                $('#eliminar_registros').show();
                $('#tablaProgramacion tbody tr #editar').show();
                $('#tablaProgramacion thead tr #editar').show();
            }
            else if (permisoLocal == "r"){
                $('#tablaProgramacion thead tr #ver').show();
                $('#tablaProgramacion tbody tr #ver').show();
            }
        },
        data: sendInfo
    });
}

