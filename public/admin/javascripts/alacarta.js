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
            getNumCarta($(searchCarta).val());
            getCarta($(searchCarta).val()); 
        }
   }); 
});

function getNumCarta(busqueda){
    var sendInfo = {
        busqueda: busqueda
    };

    $.ajax({
        type: "POST",
        url: './numCarta',
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

function getCarta(busqueda, tipo){
    var inicio = $("#inicio").val();
    var fin = $("#fin").val();
    var sendInfo = {
      inicio: inicio,
      fin: fin,
      busqueda: busqueda,
      tipo: tipo
    };

    $.ajax({
        type: "POST",
        url: './carta',
        dataType: 'json',
        
        beforeSend: function(){
            $(loading).toggleClass('loadingSDialog-after');
        },
        success: function(json) {
            if (json.status == "SUCCESS"){
                var $tr = '';
                $("#tabla tbody").empty();
                $.each(json.data, function(i, item) {
                    $tr = $('<tr>').append(
                        $('<td>').text(item.id),
                        $('<td>').text(item.producto),
                        $('<td>').text(item.descripcion),
                        $('<td>').text(item.costo),
                        $('<td id="editar" style="display:none;" align="center">').html('<a href="#" onclick="limpiarForma();editarForma('+item.id+',\''+item.producto+'\','+item.costo+',\''+item.descripcion+'\',\''+item.foto+'\',\''+item.categoria+'\');" class="fa fa-edit" style="font-size:25px;color:#000000" data-toggle="modal" data-target="#myModal"></a>'),
                        $('<td id="editar" style="display:none;" align="center">').html('<a href="#" onclick="eliminaCarta('+item.id+');" class="fa fa-trash-o" style="font-size:25px;color:#000000"></a>'),
                        $('<td id="ver" style="display:none;" align="center">').html('<a href="#" onclick="limpiarForma();verForma('+item.id+',\''+item.producto+'\','+item.costo+',\''+item.descripcion+'\',\''+item.foto+'\',\''+item.categoria+'\');" class="fa fa-sticky-note-o" style="font-size:25px;color:#000000" data-toggle="modal" data-target="#myModal"></a>'),
                        $('<td id="editar" style="display:none;"  align="center">').html('<input id="eliminarCheckbox" type="checkbox"><input value="' + item.id + '" type="hidden"> </td>')
                    );
                    $('#tabla tbody').append($tr);
                });
            }
            else{
                $("#tabla tbody").empty();
            }
            $(loading).toggleClass('loadingSDialog-after');
        },
        complete: function(){
            if (permisoLocal == "w"){
                $('#agregar_registro').show();
                $('#eliminar_registros').show();
                $('#tabla tbody tr #editar').show();
                $('#tabla thead tr #editar').show();
            }
            else if (permisoLocal == "r"){
                $('#tabla thead tr #ver').show();
                $('#tabla tbody tr #ver').show();
            }
        },
        data: sendInfo
    });
}

function buscarCarta(e){
    e.preventDefault();
    var busqueda = $("#searchCarta").val();
    getNumCarta(busqueda);
    getCarta(busqueda);
}

function nextPage(number){
    var newInicio = parseInt($("#inicio").val())+parseInt(number);
    if (newInicio>=0 && newInicio<=$("#cuenta").val()){
        $("#inicio").val(newInicio);
        $('#cuenta b').text('Registro del ' + (newInicio+1) +' al ' + (newInicio+5) + ' de ' + $('#cuenta').val());
        getCarta($(searchCarta).val());
    }
}

$(document).on("change", "input[id='check']", function () {
    if (this.checked) {
        $('#tabla').find("td input").each(function(index){
            $(this).prop('checked', true);
            $(this).attr('checked', true);
        });
    }
    else{
        $('#tabla').find("td input").each(function(index){
            $(this).prop('checked', false);
            $(this).attr('checked', false);
        });
    }
});

function limpiarForma(){
    $("#cartaIndex").css('background','#FFFFFF');
    $("#platillo").css('background','#FFFFFF');
    $("#descripcion").css('background','#FFFFFF');
    $("#costo").css('background','#FFFFFF');
    $("#categoria").css('background','#FFFFFF');

    $("#cartaIndex").prop('disabled', false);
    $("#platillo").prop('disabled', false);
    $("#descripcion").prop('disabled', false);
    $("#costo").prop('disabled', false);
    $("#categoria").prop('disabled', false);

    $(cartaIndex).val('');
    $(platillo).val('');
    $(descripcion).val('');
    $(costo).val('');
    $(categoria).val([]);
    $(foto).val('');
    $('#hiddenFoto').hide();
    $(limpiar).show();
    $(aceptar).show();
    $(cancelar).show();
    $(foto).show();
    $(fotoDiv).show();
}

function getCategorias(categoria){
    $.ajax({
        type: "GET",
        url: './categorias',
        dataType: 'json',
        
        beforeSend: function(){
            $(loading).toggleClass('loadingSDialog-after');
        },
        success: function(json) {
            if (json.status == "SUCCESS"){
                $("#categoria option").remove();
                $.each(json.data, function(i, item) {
                    $("#categoria").append(
                    $("<option></option>") // Yes you can do this.
                    .text(item.nombre)
                    .val(item.id)
                    );
                });
            }
            else{
                $("#categoria option").remove();
            }
        },
        complete: function(){
            if(categoria != null && categoria != undefined && categoria != "undefined" && categoria != "")
                $("#categoria option:contains(" + categoria + ")").attr('selected', 'selected');
            $(loading).toggleClass('loadingSDialog-after');
        }
    }); 
}

$(document).ready(function() {

     $('#form').submit(function() {
        $(loading).toggleClass('loadingSDialog-after');
        
        $(this).ajaxSubmit({
            error: function(xhr) {
                $(loading).toggleClass('loadingSDialog-after');
                alert('ERROR al insertar/actualizar el registro, por favor intenta de nuevo.');
            },
            success: function(response) {
                $(loading).toggleClass('loadingSDialog-after');
                $('#myModal').modal('hide');
                getNumCarta($(searchCarta).val());
                getCarta($(searchCarta).val());
            }
    });
    return false;
    });    
});

function editarForma(id,producto,costo,descripcion,foto,categoria){
    getCategorias(categoria);
    $(limpiar).hide();
    $("#cartaIndex").val(id);
    $("#platillo").val(producto);
    $('#descripcion').val(descripcion);
    $('#costo').val(costo);
    $('#hiddenFoto').show();
    $(hiddenFotoImage).attr("src","../uploads/"+foto);  
}

function verForma(id,producto,costo,descripcion,foto,categoria){
    getCategorias(categoria);

    $(limpiar).hide();
    $(aceptar).hide();
    $(cancelar).hide();
    $(fotoDiv).hide();

    $("#cartaIndex").prop('disabled', true);
    $("#platillo").prop('disabled', true);
    $("#descripcion").prop('disabled', true);
    $("#costo").prop('disabled', true);
    $("#categoria").prop('disabled', true);

    $("#cartaIndex").css('background','#F2F2F2');
    $("#platillo").css('background','#F2F2F2');
    $("#descripcion").css('background','#F2F2F2');
    $("#costo").css('background','#F2F2F2');
    $("#categoria").css('background','#F2F2F2');

    $("#cartaIndex").val(id);
    $("#platillo").val(producto);
    $('#descripcion').val(descripcion);
    $('#costo').val(costo);
    $('#hiddenFoto').show();
    $(hiddenFotoImage).attr("src","../uploads/"+foto);
}

function eliminaCarta(idCarta){
    var carta = "("+idCarta+")";
    var sendInfo = {
        carta: carta
    };
    
    $.ajax({
        type: "POST",
        url: './eliminaCarta',
        dataType: 'json',
      
        beforeSend: function(){
            $(loading).toggleClass('loadingSDialog-after');
        },
        success: function(json) {
            $(loading).toggleClass('loadingSDialog-after');
            getNumCarta($(searchCarta).val());
            getCarta($(searchCarta).val());
        },
        data: sendInfo
    });
}

function eliminaCartas(){
    var carta = "(";
    $('#tabla').find("td input").each(function(index){
        if($(this).attr('id')=="eliminarCheckbox" && $(this).is(':checked'))
            carta = carta + $(this).next('input').val() + ",";
    });
    carta = carta.substr(0, carta.length-1) + ")";

    var sendInfo = {
        carta: carta
    };

    $.ajax({
        type: "POST",
        url: './eliminaCarta',
        dataType: 'json',
      
        beforeSend: function(){
            $(loading).toggleClass('loadingSDialog-after');
        },
        success: function(json) {
            $(loading).toggleClass('loadingSDialog-after');
            getNumCarta($(searchCarta).val());
            getCarta($(searchCarta).val());
            $('#check').attr('checked', false);
        },
        data: sendInfo
    });
}

function exportarCarta(){
    window.location= "./exportaCarta?busqueda=" + $('#searchCarta').val();
}
