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
            getPerfiles();
        }
   }); 
});

function getPerfiles(){
	$.ajax({
		type: "GET",
		url: './perfiles',
		dataType: 'json',

		beforeSend: function(){
			$(loading).toggleClass('loadingSDialog-after');
		},
		success: function(json) {
			if (json.status == "SUCCESS"){
				var $tr = '';
				$("#tablaPerfiles tbody").empty();
				$.each(json.data, function(i, item) {
					$tr = $('<tr>').append(
						$('<td>').text(item.id),
						$('<td>').text(item.perfil),
						$('<td>').text(item.descripcion)
					);
					$('#tablaPerfiles tbody').append($tr);
				});
			}
			else{
				$("#tablaEmpleados tbody").empty();
			}
			$(loading).toggleClass('loadingSDialog-after');
		}
	});
}
