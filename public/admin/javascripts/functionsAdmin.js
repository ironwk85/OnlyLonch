
/**************************************************************/
/*************************COMMON*******************************/
/**************************************************************/

function adminLogout(){
    $.ajax({
        type: "GET",
        url: './logout',
        dataType: 'json',
        success: function(json) {
            location.reload();
        }
    });
}

addEventListener(
    "load", function() { 
        setTimeout(hideURLbar, 0); 
    }, false); 

function hideURLbar(){ 
    window.scrollTo(0,1); 
}

$(function () {
    $('#supported').text('Supported/allowed: ' + !!screenfull.enabled);
    if (!screenfull.enabled) {
        return false;
    }
    $('#toggle').click(function () {
        screenfull.toggle($('#container')[0]);
    });
}); 

/**************************************************************/
/*********************dashboard.html***************************/
/**************************************************************/

function loginUser(e){
    e.preventDefault();
    var email = $(usuario).val();
    var pass = CryptoJS.SHA256($(password).val()) + ""; //var pass = $(password).val();
    var sendInfo = {
        email: email,
        pass: pass
    };

    $.ajax({
        type: "POST",
        dataType: 'json',
        url: "./login",
        beforeSend: function(){
            $(loading).toggleClass('loadingSDialog-after');
        },
        success: function (json) {
            $(loading).toggleClass('loadingSDialog-after');
            if (json.status == "SUCCESS"){
                window.location.href = "./dashboard.html";
            }
            else{
                alert("Usuario y/o pasword incorrectos.");
            }
        },
        data: sendInfo
    });
};

//$(document).ready(function(){
//  /*$("#dropdown-1 ul li a").click(function(){
//     var selText = $(this).text();
//     $(this).parents('#dropdown-1').find('.dropdown-toggle').html(selText+' <span class="caret"></span>');
//     });*/
//  $.ajax({
//        type: "GET",
//        url: './usuarios/activeSession',
//        dataType: 'json',
//        success: function(json) {
//            
//        }
//    }); 
//});

/**************************************************************/
/*********************empleados.html***************************/
/**************************************************************/

//function hideURLbar(){
//    window.scrollTo(0,1); 
//} 

function getNumEmpleados(busqueda,tipo){
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
        url: './numEmpleados',
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

/*addEventListener("load", 
    function() {
        setTimeout(hideURLbar, 0); 
    }, false
);*/
/**************************************************************/
/*function hideURLbar(){ 
    window.scrollTo(0,1); 
}*/
/**************************************************************/
$(function () {
    $('#supported').text('Supported/allowed: ' + !!screenfull.enabled);
    if (!screenfull.enabled) {
        return false;
    }
    $('#toggle').click(function () {
        screenfull.toggle($('#container')[0]);
    });
});

/**************************************************************/
/*******************cuentasUsuario.html************************/
/**************************************************************/

function getPerfiles(perfil){
    $.ajax({
      type: "GET",
      url: './perfiles',
      dataType: 'json',
      beforeSend: function(){
        $(loading).toggleClass('loadingSDialog-after');
      },
      success: function(json) {
        if (json.status == "SUCCESS"){
            $("#opcionesPerfil option").remove();
            $.each(json.data, function(i, item) {
                $("#opcionesPerfil").append(
                $("<option></option>") // Yes you can do this.
                .text(item.perfil)
                .val(item.id)
                );
            });
        }
        else{
            $("#opcionesPerfil option").remove();
        }
        if(perfil != "Sin perfil")
          $("#opcionesPerfil option:contains(" + perfil + ")").attr('selected', 'selected');
      
        $(loading).toggleClass('loadingSDialog-after');
      }
    });
  }
