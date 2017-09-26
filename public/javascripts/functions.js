// /*function showBar(){
//     document.getElementById("bar").className = "";
//     document.getElementById("bar").className = "fade-in";
//     var canvas4 = document.getElementById('mycanvas4');
//     if(canvas4.getContext){
//         var ctx = canvas4.getContext('2d');
//         ctx.lineWidth = 1+8;
//         ctx.beginPath();
//         ctx.moveTo(5+8*14,5);
//         ctx.lineTo(5+8*14,148);
//         ctx.strokeStyle="black";
//         ctx.stroke();
//     }
// }*/

// $(document).ready(function(){
//   /*$("#dropdown-1 ul li a").click(function(){
//      var selText = $(this).text();
//      $(this).parents('#dropdown-1').find('.dropdown-toggle').html(selText+' <span class="caret"></span>');
//      });*/
//   $.ajax({
//         type: "GET",
//         url: './usuarios/activeSession',
//         dataType: 'json',
//         success: function(json) {
//             if (json.status == "SUCCESS"){
//                 //$('#iniciarSesion').prop('onclick',null).off('click');
//                 $('#iniciarSesion').attr('onclick',"forceLogout()");
//                 //$('#iniciarSesion b').text('Logout');
//                 $('#iniciarSesion b').text('Hola ' + json.data.nombre);
//                 $('#iniciarSesion img').attr("src",json.data.foto);
//             }
//         }
//     }); 
// });

// function enviaRegistro(e){
//     e.preventDefault();

//     var nombre = $("#myname_reg").val();
//     var email = $("#myemail_reg").val();
//     var phone = $("#myphone_reg").val();
//     var photo = $("#photo").val();
//     var pass = CryptoJS.SHA256($("#mypwd_reg").val()) + "";
//     var rememberMe = document.getElementById('rememberMe_login');

//     var sendInfo = {
//         nombre: nombre,
//         email: email,
//         phone: phone,
//         photo: photo,
//         pass: pass,
//         rememberMe: rememberMe.checked
//     };

//     $.ajax({
//         type: "POST",
//         dataType: 'json',
//         url: "./usuarios",
//         beforeSend: function(){
//             $(loading).toggleClass('loadingSDialog-after');
//         },
//         success: function (json) {
//             if (json.status == "SUCCESS"){
//                 //$('#iniciarSesion').prop('onclick',null).off('click');
//                 $('#iniciarSesion').attr('onclick',"forceLogout();");
//                 //$('#iniciarSesion b').text('Logout');
//                 $('#iniciarSesion b').text('Hola ' + json.data.nombre);
//                 $('#iniciarSesion img').attr("src",json.data.foto);
//                 $(register).toggleClass('registroDialog-after');
//             }
//             else if (json.status == "DUPLICATE"){
//                 $(registerMessage).text('Este usuario ya existe.');
//                 $(registerMessage).css('color', 'red');
//             }
//             else {
//                 $(registerMessage).text('Ocurrió un eror, inténtalo nuevamente.');
//                 $(registerMessage).css('color', 'red');
//             }
//             $(loading).toggleClass('loadingSDialog-after');
//         },
//         data: sendInfo
//     });
// }

// function loginUser(e){
//     var email = $("#myemail_login").val();
//     var pass = CryptoJS.SHA256($("#mypwd_login").val()) + "";
//     var rememberMe = document.getElementById('rememberMe_login');

//     var sendInfo = {
//         email: email,
//         pass: pass,
//         rememberMe: rememberMe.checked
//     };

//     $.ajax({
//         type: "POST",
//         dataType: 'json',
//         url: "./usuarios/login",
//         beforeSend: function(){
//             $(loading).toggleClass('loadingSDialog-after');
//         },
//         success: function (json) {
//             if (json.status == "SUCCESS"){
//                 //$('#iniciarSesion').prop('onclick',null).off('click');
//                 $('#iniciarSesion').attr('onclick',"forceLogout();");
//                 //$('#iniciarSesion b').text('Logout');
//                 $('#iniciarSesion b').text('Hola ' + json.data.nombre);
//                 $('#iniciarSesion img').attr("src",json.data.foto);
//                 $(login).toggleClass('inicioSDialog-after');
//             }
//             else{
//                 $(loginMessage).text('Usuario y/o contraseña inválidos, inténtalo nuevamente');
//                 $(loginMessage).css('color', 'red');
//             }
//             $(loading).toggleClass('loadingSDialog-after');
//         },
//         data: sendInfo
//     });
// }

// function loginUserFacebook(email){
//     var rememberMe = document.getElementById('rememberMe_login');

//     var sendInfo = {
//         email: email,
//         rememberMe: rememberMe.checked
//     };

//     $.ajax({
//         type: "POST",
//         dataType: 'json',
//         url: "./usuarios/loginFacebook",
//         success: function (json) {
//             if (json.status == "SUCCESS"){
//                 //$('#iniciarSesion').prop('onclick',null).off('click');
//                 $('#iniciarSesion').attr('onclick',"forceLogout();");
//                 $('#iniciarSesion b').text('Hola ' + json.data.nombre);
//                 $('#iniciarSesion img').attr("src",json.data.foto);
//                 $(login).toggleClass('inicioSDialog-after');
//             }
//             else{
//                 $(loginMessage).text('Este usuario no existe, inténtalo nuevamente');
//                 $(loginMessage).css('color', 'red');
//             }
//             $(loading).toggleClass('loadingSDialog-after');
//         },
//         data: sendInfo
//     });
// }

// function initializeValues(){
//     $(loginMessage).text('Inicia Sesión con los datos con los que creaste tu perfil');
//     $(loginMessage).css('color', 'black');
//     $("#myemail_login").val('');
//     $("#mypwd_login").val('');
//     $(registerMessage).text('Crea tu perfil una vez para poder ordenar y dar seguimiento a todos tus pedidos de la modalidad AL MOMENTO o A LA CARTA. Tus datos están seguros y sólo los ocupamos para dar seguimiento a tus pedidos.');
//     $(registerMessage).css('color', 'black');
//     $(myname_reg).val('');
//     $(myemail_reg).val('');
//     $(myphone_reg).val('');
//     $(mypwd_reg).val('');
//     $(mypwd2_reg).val('');
//     $(photo).val('');
// }

// function forceLogout(){
//     $.ajax({
//         type: "GET",
//         url: './usuarios/forceLogout',
//         dataType: 'json',
//         success: function(json) {
//             location.reload();
//         }
//     });
// }
// /*
// $( window ).unload(function() {
//     alert("exiting");
//     $.ajax({
//         type: "GET",
//         url: './usuarios/logout',
//         dataType: 'json',
//         success: function(json) {
//             console.log( "Handler for .unload() called." );
//         }
//     });
// });*/

function remove_nuevo(){
    $("#nuevo_boton").removeClass("orange_underline");
    $("#viejo_boton").addClass("orange_underline");
}

function remove_viejo(){
    $("#viejo_boton").removeClass("orange_underline");
    $("#nuevo_boton").addClass("orange_underline");
}
