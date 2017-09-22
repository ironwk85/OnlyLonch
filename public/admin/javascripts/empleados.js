var permisoLocal = "";

$(document).ready(function(){
    $.ajax({
       type: "GET",
       url: './authorization',
       dataType: 'json',
       success: function (json) {
            var permisos = json.data.permisos;

            permisoLocal = permisos[0];
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
            getNumEmpleados($(searchEmpleado).val(),1);
            getEmpleados($(searchEmpleado).val(),1); 
        }
   }); 
});

$(document).on("change", "input[id='check']", function () {
    if (this.checked) {
        $('#tablaEmpleados').find("td input").each(function(index){
            $(this).prop('checked', true);
            $(this).attr('checked', true);
        });
    }
    else{
        $('#tablaEmpleados').find("td input").each(function(index){
            $(this).prop('checked', false);
            $(this).attr('checked', false);
        });
    }
});

$(function() {
    $("#empleadoForm").find("input,textarea,select").jqBootstrapValidation
    ({
        preventSubmit: true,
        submitError: function($form, event, errors) {
            //DO-NOTHING
        },
        submitSuccess: function($form, event) {
            event.preventDefault();
            var idEmpleado = $("#idEmpleado").val();
            var nombre = $("#nombre").val();
            var appaterno = $("#appaterno").val();
            var apmaterno = $("#apmaterno").val();
            var email = $("#email").val();
            var celular = $("#celular").val();
            var telefono = $("#telefono").val();
            var avenida = $("#avenida").val();
            var noExterior = $("#noExterior").val();
            var noInterior = $("#noInterior").val();
            var colonia = $("#colonia").val();
            var ciudad = $("#ciudad").val();
            var municipio = $("#municipio").val();
            var estado = $("#estado").val();
            var cp = $("#cp").val();
            var urlString = '';

            var sendInfo = {
                idEmpleado: idEmpleado,
                nombre: nombre,
                appaterno: appaterno,
                apmaterno: apmaterno,
                email: email,
                celular: celular,
                telefono: telefono,
                avenida: avenida,
                noExterior: noExterior,
                noInterior: noInterior,
                colonia: colonia,
                ciudad: ciudad,
                municipio: municipio,
                estado: estado,
                cp: cp
            };
        
            if (idEmpleado != null && idEmpleado != ""){
                urlString = './actualizaEmpleado';
            }
            else{
                urlString = './agregaEmpleado';
            }
        
            $.ajax({
                type: "POST",
                url: urlString,
                dataType: 'json',
                
                beforeSend: function(){
                    $(loading).toggleClass('loadingSDialog-after');
                },
                success: function(json) {
                    limpiarForma();
                    $(loading).toggleClass('loadingSDialog-after');
                    $('#myModal').modal('hide');
                    getNumEmpleados($(searchEmpleado).val(),1);
                    getEmpleados($(searchEmpleado).val(),1);
                },
                error: function(){
                    alert("ERROR al insertar/actualizar el registro, por favor intenta de nuevo.");
                },
                data: sendInfo
            });
        },
        filter: function() {
            return $(this).is(":visible");
        }
    });
});

function getEmpleados(busqueda, tipo){
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
        url: './empleados',
        dataType: 'json',
        
        beforeSend: function(){
            $(loading).toggleClass('loadingSDialog-after');
        },
        success: function(json) {
            if (json.status == "SUCCESS"){
                var $tr = '';
                $("#tablaEmpleados tbody").empty();
                $.each(json.data, function(i, item) {
                    $tr = $('<tr>').append(
                        $('<td>').text(item.nombre),
                        $('<td>').text(item.apellido1),
                        $('<td>').text(item.apellido2),
                        $('<td>').text(item.email),
                        $('<td>').text(item.noCel),
                        $('<td>').text(item.perfil),
                        $('<td id="editar" style="display:none;" align="center">').html('<a href="#" onclick="limpiarForma();editarEmpleadoForma('+item.id+',\''+item.nombre+'\',\''+item.apellido1+'\',\''+item.apellido2+'\',\''+item.email+'\',\''+item.noCel+'\',\''+item.noTel+'\',\''+item.noInt+'\',\''+item.noExt+'\',\''+item.calle+'\',\''+item.colonia+'\',\''+item.ciudad+'\',\''+item.municipio+'\',\''+item.estado+'\',\''+item.cp+'\');" class="fa fa-edit" style="font-size:25px;color:#000000" data-toggle="modal" data-target="#myModal"></a>'),
                        $('<td id="editar" style="display:none;" align="center">').html('<a href="#" onclick="eliminaEmpleado('+item.id+');" class="fa fa-trash-o" style="font-size:25px;color:#000000"></a>'),
                        $('<td id="ver" style="display:none;" align="center">').html('<a href="#" onclick="limpiarForma();verEmpleadoForma('+item.id+',\''+item.nombre+'\',\''+item.apellido1+'\',\''+item.apellido2+'\',\''+item.email+'\',\''+item.noCel+'\',\''+item.noTel+'\',\''+item.noInt+'\',\''+item.noExt+'\',\''+item.calle+'\',\''+item.colonia+'\',\''+item.ciudad+'\',\''+item.municipio+'\',\''+item.estado+'\',\''+item.cp+'\');" class="fa fa-sticky-note-o" style="font-size:25px;color:#000000" data-toggle="modal" data-target="#myModal"></a>'),
                        $('<td id="editar" style="display:none;"  align="center">').html('<input id="eliminarCheckbox" type="checkbox"><input value="' + item.id + '" type="hidden"> </td>')
                    );
                    $('#tablaEmpleados tbody').append($tr);
                });
            }
            else{
                $("#tablaEmpleados tbody").empty();
            }
            $(loading).toggleClass('loadingSDialog-after');
        },
        complete: function(){
            if (permisoLocal == "w"){
                $('#agregar_registro').show();
                $('#eliminar_registros').show();
                $('#tablaEmpleados tbody tr #editar').show();
                $('#tablaEmpleados thead tr #editar').show();
            }
            else if (permisoLocal == "r"){
                $('#tablaEmpleados thead tr #ver').show();
                $('#tablaEmpleados tbody tr #ver').show();
            }
        },
        data: sendInfo
    });
}

function limpiarForma(){
    $("#idEmpleado").prop('disabled', false);
    $("#nombre").prop('disabled', false);
    $("#appaterno").prop('disabled', false);
    $("#apmaterno").prop('disabled', false);
    $("#email").prop('disabled', false);
    $("#celular").prop('disabled', false);
    $("#telefono").prop('disabled', false);
    $("#avenida").prop('disabled', false);
    $("#noExterior").prop('disabled', false);
    $("#noInterior").prop('disabled', false);
    $("#colonia").prop('disabled', false);
    $("#ciudad").prop('disabled', false);
    $("#municipio").prop('disabled', false);
    $("#estado").prop('disabled', false);
    $("#cp").prop('disabled', false);

    $("#idEmpleado").css('background','#FFFFFF');
    $("#nombre").css('background','#FFFFFF');
    $("#appaterno").css('background','#FFFFFF');
    $("#apmaterno").css('background','#FFFFFF');
    $("#email").css('background','#FFFFFF');
    $("#celular").css('background','#FFFFFF');
    $("#telefono").css('background','#FFFFFF');
    $("#avenida").css('background','#FFFFFF');
    $("#noExterior").css('background','#FFFFFF');
    $("#noInterior").css('background','#FFFFFF');
    $("#colonia").css('background','#FFFFFF');
    $("#ciudad").css('background','#FFFFFF');
    $("#municipio").css('background','#FFFFFF');
    $("#estado").css('background','#FFFFFF');
    $("#cp").css('background','#FFFFFF');

    $("#idEmpleado").val("");
    $("#nombre").val("");
    $("#appaterno").val("");
    $("#apmaterno").val("");
    $("#email").val("");
    $("#celular").val("");
    $("#telefono").val("");
    $("#avenida").val("");
    $("#noExterior").val("");
    $("#noInterior").val("");
    $("#colonia").val("");
    $("#ciudad").val("");
    $("#municipio").val("");
    $("#estado").val("");
    $("#cp").val("");

    $('#modal_aceptar').hide();
    $('#modal_cancelar').hide();
    $('#modal_limpiar').hide();
}

function limpiarFormaAgregar(){
    $('#modal_aceptar').show();
    $('#modal_cancelar').show();
    $('#modal_limpiar').show();
}

function verEmpleadoForma(idEmpleado,nombre,ap1,ap2,email,cel,tel,noInt,noExt,calle,colonia,ciudad,municipio,estado,cp){
    $("#idEmpleado").prop('disabled', true);
    $("#nombre").prop('disabled', true);
    $("#appaterno").prop('disabled', true);
    $("#apmaterno").prop('disabled', true);
    $("#email").prop('disabled', true);
    $("#celular").prop('disabled', true);
    $("#telefono").prop('disabled', true);
    $("#avenida").prop('disabled', true);
    $("#noExterior").prop('disabled', true);
    $("#noInterior").prop('disabled', true);
    $("#colonia").prop('disabled', true);
    $("#ciudad").prop('disabled', true);
    $("#municipio").prop('disabled', true);
    $("#estado").prop('disabled', true);
    $("#cp").prop('disabled', true);

    $("#idEmpleado").css('background','#F2F2F2');
    $("#nombre").css('background','#F2F2F2');
    $("#appaterno").css('background','#F2F2F2');
    $("#apmaterno").css('background','#F2F2F2');
    $("#email").css('background','#F2F2F2');
    $("#celular").css('background','#F2F2F2');
    $("#telefono").css('background','#F2F2F2');
    $("#avenida").css('background','#F2F2F2');
    $("#noExterior").css('background','#F2F2F2');
    $("#noInterior").css('background','#F2F2F2');
    $("#colonia").css('background','#F2F2F2');
    $("#ciudad").css('background','#F2F2F2');
    $("#municipio").css('background','#F2F2F2');
    $("#estado").css('background','#F2F2F2');
    $("#cp").css('background','#F2F2F2');

    $("#idEmpleado").val(idEmpleado);
    $("#nombre").val(nombre);
    $("#appaterno").val(ap1);
    $("#apmaterno").val(ap2);
    $("#email").val(email);
    $("#celular").val(cel);
    $("#telefono").val(tel);
    $("#avenida").val((calle&&calle!='')?calle:'');
    $("#noExterior").val((noExt&&noExt!='')?noExt:'');
    $("#noInterior").val((noInt&&noInt!='')?noInt:'');
    $("#colonia").val((colonia&&colonia!='')?colonia:'');
    $("#ciudad").val((ciudad&&ciudad!='')?ciudad:'');
    $("#municipio").val((municipio&&municipio!='')?municipio:'');
    $("#estado").val((estado&&estado!='')?estado:'');
    $("#cp").val((cp&&cp!='')?cp:'');
}

function editarEmpleadoForma(idEmpleado,nombre,ap1,ap2,email,cel,tel,noInt,noExt,calle,colonia,ciudad,municipio,estado,cp){
    $("#idEmpleado").val(idEmpleado);
    $("#nombre").val(nombre);
    $("#appaterno").val(ap1);
    $("#apmaterno").val(ap2);
    $("#email").val(email);
    $("#celular").val(cel);
    $("#telefono").val(tel);
    $("#avenida").val((calle&&calle!='')?calle:'');
    $("#noExterior").val((noExt&&noExt!='')?noExt:'');
    $("#noInterior").val((noInt&&noInt!='')?noInt:'');
    $("#colonia").val((colonia&&colonia!='')?colonia:'');
    $("#ciudad").val((ciudad&&ciudad!='')?ciudad:'');
    $("#municipio").val((municipio&&municipio!='')?municipio:'');
    $("#estado").val((estado&&estado!='')?estado:'');
    $("#cp").val((cp&&cp!='')?cp:'');

    $('#modal_aceptar').show();
    $('#modal_cancelar').show();
    $('#modal_limpiar').hide();
}

function nextPage(number){
    var newInicio = parseInt($("#inicio").val())+parseInt(number);
    if (newInicio>=0 && newInicio<=$("#cuenta").val()){
        $("#inicio").val(newInicio);
        $('#cuenta b').text('Registro del ' + (newInicio+1) +' al ' + (newInicio+5) + ' de ' + $('#cuenta').val());
        getEmpleados($(searchEmpleado).val(),1);
    }
}

function eliminaEmpleado(idEmpleado){
    var empleados = "("+idEmpleado+")";
    var sendInfo = {
        empleados: empleados
    };
    
    $.ajax({
        type: "POST",
        url: './eliminaEmpleados',
        dataType: 'json',
      
        beforeSend: function(){
            $(loading).toggleClass('loadingSDialog-after');
        },
        success: function(json) {
            $(loading).toggleClass('loadingSDialog-after');
            getNumEmpleados($(searchEmpleado).val(),1);
            getEmpleados($(searchEmpleado).val(),1);
        },
        data: sendInfo
    });
}

function eliminaEmpleados(){
    var empleados = "(";
    $('#tablaEmpleados').find("td input").each(function(index){
        if($(this).attr('id')=="eliminarCheckbox" && $(this).is(':checked'))
            empleados = empleados + $(this).next('input').val() + ",";
    });
    empleados = empleados.substr(0, empleados.length-1) + ")";

    var sendInfo = {
        empleados: empleados
    };

    $.ajax({
        type: "POST",
        url: './eliminaEmpleados',
        dataType: 'json',
      
        beforeSend: function(){
            $(loading).toggleClass('loadingSDialog-after');
        },
        success: function(json) {
            $(loading).toggleClass('loadingSDialog-after');
            getNumEmpleados($(searchEmpleado).val(),1);
            getEmpleados($(searchEmpleado).val(),1);
            $('#check').attr('checked', false);
        },
        data: sendInfo
    });
}

function buscarEmpleados(e){
    e.preventDefault();
    var busqueda = $("#searchEmpleado").val();
    getNumEmpleados(busqueda,1);
    getEmpleados(busqueda,1);
}

function exportarEmpleados(){
    window.location= "./exportaEmpleados?busqueda=" + $('#searchEmpleado').val() + "&tipo=1";
}
