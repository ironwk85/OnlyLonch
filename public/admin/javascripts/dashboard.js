$(document).ready(function(){
 $.ajax({
       type: "GET",
       url: './authorization',
       dataType: 'json',
       success: function (json) {
            var permisos = json.data.permisos;
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
        }
   }); 
});