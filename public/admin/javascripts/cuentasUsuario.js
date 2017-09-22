var permisoLocal = "";

$(document).ready(function(){
    $.ajax({
       type: "GET",
       url: './authorization',
       dataType: 'json',
       success: function (json) {
            var permisos = json.data.permisos;

            permisoLocal = permisos[1];
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
            getNumEmpleados($(searchEmpleado).val(),2);
            getEmpleados($(searchEmpleado).val(),2); 
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
    $("#cuentasUsuarioForm").find("input,textarea,select").jqBootstrapValidation
    ({
    	preventSubmit: true,
        submitError: function($form, event, errors) {
            //DO-NOTHING
        },
        submitSuccess: function($form, event) {
            event.preventDefault();
		    var empleadoIndex = $('#empleadoIndex').val();
		    var email = $(email).val();
		    var pass;
		    var perfil = $(opcionesPerfil).val();

		    if (pass != "secreto")
		    	pass = CryptoJS.SHA256($(password1).val()) + "";

		    var sendInfo = {
		        empleadoIndex: empleadoIndex,
		        email: email,
		        pass: pass,
		        perfil: perfil
		    };

		    $.ajax({
		        type: "POST",
		        dataType: 'json',
		        url: "./agregaPerfil",
		        beforeSend: function(){
		            $(loading).toggleClass('loadingSDialog-after');
		        },
		        success: function (json) {
		            $(loading).toggleClass('loadingSDialog-after');
		            if (json.status == "SUCCESS"){
		                limpiarForma();
		                $('#myModal').modal('hide');
		                getNumEmpleados($(searchEmpleado).val(),2);
		                getEmpleados($(searchEmpleado).val(),2);
		            }
		            else{
		                alert("ERROR al insertar/actualizar el registro, por favor intenta de nuevo.");
		            }
		        },
		        data: sendInfo
		    });
		},
        filter: function() {
            return $(this).is(":visible");
        }
    })
})

function getEmpleados(busqueda,tipo){
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
	          $('<td>').text(item.id),
	          $('<td>').text(item.email),
	          $('<td>').text(item.perfil),
	          $('<td id="editar" style="display:none;" align="center">').html('<a href="#" onclick="limpiarForma();editarEmpleadoForma('+item.id+',\''+item.nombreCompleto+'\',\''+item.apellido1+'\',\''+item.apellido2+'\',\''+item.email+'\',\''+item.noCel+'\',\''+item.noTel+'\',\''+item.noInt+'\',\''+item.noExt+'\',\''+item.calle+'\',\''+item.colonia+'\',\''+item.ciudad+'\',\''+item.municipio+'\',\''+item.estado+'\',\''+item.cp+'\',\''+item.perfil+'\',\''+item.password+'\');" class="fa fa-edit" style="font-size:25px;color:#000000" data-toggle="modal" data-target="#myModal"></a>'),
	          $('<td id="editar" style="display:none;" align="center">').html('<a href="#" onclick="eliminaEmpleado('+item.id+');" class="fa fa-trash-o" style="font-size:25px;color:#000000"></a>'),
	          $('<td id="ver" style="display:none;" align="center">').html('<a href="#" onclick="limpiarForma();verEmpleadoForma('+item.id+',\''+item.nombreCompleto+'\',\''+item.apellido1+'\',\''+item.apellido2+'\',\''+item.email+'\',\''+item.noCel+'\',\''+item.noTel+'\',\''+item.noInt+'\',\''+item.noExt+'\',\''+item.calle+'\',\''+item.colonia+'\',\''+item.ciudad+'\',\''+item.municipio+'\',\''+item.estado+'\',\''+item.cp+'\',\''+item.perfil+'\',\''+item.password+'\');" class="fa fa-sticky-note-o" style="font-size:25px;color:#000000" data-toggle="modal" data-target="#myModal"></a>'),
	          $('<td id="editar" style="display:none;" align="center">').html('<input id="eliminarCheckbox" type="checkbox"><input value="' + item.id + '" type="hidden"> </td>')
	        );
	        $('#tablaEmpleados tbody').append($tr);
	      });
	    }
	    else{
	      $("#tablaEmpleados tbody").empty();
	    }
	  },
	  complete: function(){
            if (permisoLocal == "w"){
            	$('#tablaEmpleados thead tr #ver').hide();
                $('#tablaEmpleados tbody tr #ver').hide();

                $('#agregar_registro').show();
                $('#eliminar_registros').show();
                $('#tablaEmpleados tbody tr #editar').show();
                $('#tablaEmpleados thead tr #editar').show();
            }
            else if (permisoLocal == "r"){
            	$('#agregar_registro').hide();
                $('#eliminar_registros').hide();
                $('#tablaEmpleados tbody tr #editar').hide();
                $('#tablaEmpleados thead tr #editar').hide();

                $('#tablaEmpleados thead tr #ver').show();
                $('#tablaEmpleados tbody tr #ver').show();
            }
      },
	  data: sendInfo
	});

	var sendInfo = {
	  inicio: inicio,
	  fin: fin,
	  busqueda: busqueda,
	  tipo: 3
	};
	$.ajax({
	  type: "POST",
	  url: './empleados',
	  dataType: 'json',
	  success: function(json) {
	    if (json.status == "SUCCESS"){

	        var options = {
	            data: json.data,
	            getValue: "nombreCompleto",
	            list: {
	                match: {
	                    enabled: true
	                },
	                onSelectItemEvent: function() {
	                    var value = $("#empleado").getSelectedItemData().email;
	                    $("#email").val(value).trigger("change");

	                    var index = $("#empleado").getSelectedItemData().id;
	                    $("#empleadoIndex").val(index).trigger("change");
	                }
	            }
	        };
	        $("#empleado").easyAutocomplete(options);
	    }
	    $(loading).toggleClass('loadingSDialog-after');
	  },
	  data: sendInfo
	});
}

function limpiarForma(){
	$("#empleado").prop('disabled', false);
    $("#email").prop('disabled', false);
    $("#password1").prop('disabled', false);
    $("#password2").prop('disabled', false);
    $("#opcionesPerfil").prop('disabled', false);

    $("#password1").css('background','#FFFFFF');
    $("#password2").css('background','#FFFFFF');
    $("#opcionesPerfil").css('background','#FFFFFF');
    $('#empleado').css('background','#FFFFFF');
    $('#email').css('background','#F2F2F2');

    $("#empleadoIndex").val("");
    $("#empleado").val("");
    $("#email").val("");
    $("#password1").val("");
    $("#password2").val("");
    $("#opcionesPerfil").val([]);

    $('#modal_aceptar').hide();
    $('#modal_cancelar').hide();
    $('#modal_limpiar').hide();
    $("#p1").show();
    $("#p2").show();
  }

  function limpiarFormaAgregar(){
    $('#modal_aceptar').show();
    $('#modal_cancelar').show();
    $('#modal_limpiar').show();
}

function editarEmpleadoForma(idEmpleado,nombre,ap1,ap2,email,cel,tel,noInt,noExt,calle,colonia,ciudad,municipio,estado,cp,perfil,password){
    getPerfiles(perfil);
    $("#empleado").val(nombre);
    $("#email").val(email);
    $('#empleadoIndex').val(idEmpleado);
	$('#password1').val('secreto');
	$('#password2').val('secreto');
    $('#empleado').css('background','#F2F2F2');
    $('#email').css('background','#F2F2F2');
    $('#modal_limpiar').hide();
    $("#empleado").prop('disabled', true);
    $('#modal_aceptar').show();
    $('#modal_cancelar').show();
}

function verEmpleadoForma(idEmpleado,nombre,ap1,ap2,email,cel,tel,noInt,noExt,calle,colonia,ciudad,municipio,estado,cp,perfil,password){
    getPerfiles(perfil);
    
    $("#empleado").prop('disabled', true);
    $("#email").prop('disabled', true);
    $("#password1").prop('disabled', true);
    $("#password2").prop('disabled', true);
    $("#opcionesPerfil").prop('disabled', true);

    $("#p1").hide();
    $("#p2").hide();

    $("#empleado").css('background','#F2F2F2');
    $("#email").css('background','#F2F2F2');
    $("#password1").css('background','#F2F2F2');
    $("#password2").css('background','#F2F2F2');
    $("#opcionesPerfil").css('background','#F2F2F2');

    $("#empleado").val(nombre);
    $("#email").val(email);
    $('#empleadoIndex').val(idEmpleado);
	$('#password1').val('secreto');
	$('#password2').val('secreto');
}

var password;
  var confirm_password;

function validatePassword(){
  password = document.getElementById("password1");
  confirm_password = document.getElementById("password2");

  if(password.value != confirm_password.value) {
    confirm_password.setCustomValidity("Los paswords deben ser idénticos.");
  } else {
    confirm_password.setCustomValidity('');
  }
}

////

function nextPage(number){
    var newInicio = parseInt($("#inicio").val())+parseInt(number);
    if (newInicio>=0 && newInicio<=$("#cuenta").val()){
        $("#inicio").val(newInicio);
        $('#cuenta b').text('Registro del ' + (newInicio+1) +' al ' + (newInicio+5) + ' de ' + $('#cuenta').val());
        getEmpleados($(searchEmpleado).val(),2);
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
            getNumEmpleados($(searchEmpleado).val(),2);
            getEmpleados($(searchEmpleado).val(),2);
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
            getNumEmpleados($(searchEmpleado).val(),2);
            getEmpleados($(searchEmpleado).val(),2);
            $('#check').attr('checked', false);
        },
        data: sendInfo
    });
}

function buscarEmpleados(e){
    e.preventDefault();
    var busqueda = $("#searchEmpleado").val();
    getNumEmpleados(busqueda,2);
    getEmpleados(busqueda,2);
}