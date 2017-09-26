
angular.module('sessionApp.controllers', [])
	.controller('mainController', function($scope, apiService) {  
  		$scope.emailInput = "";
		$scope.nombreInput = "";
		$scope.apellidoInput = "";
		$scope.photoInput = "";
		$scope.showRegister = false;
		$scope.userImage = false;

  		$scope.registroFacebook = function() {
  			$scope.emailInput = "";
			$scope.nombreInput = "";
			$scope.apellidoInput = "";
			$scope.photoInput = "";

	    	FB.login(function(response) {
				if (response.status === 'connected') {
					FB.api('/me', {fields: 'name, email,picture.width(100).height(100)'}, function(response) {
						console.log(response);
						$scope.emailInput = response.email;
						$scope.nombreInput = response.name.split(" ")[0];
						$scope.apellidoInput = response.name.split(" ")[1];
						$scope.photoInput = response.picture.data.url;
						$scope.$apply();
						console.log("---------------------");
						console.log($scope.emailInput);
						console.log("---------------------");
					});
				} 
				else if (response.status === 'not_authorized')
			    	console.log("not authorized");
				else
			    	console.log("not logged onto Facebook");
			}
			,{scope: 'public_profile,email,user_birthday'}
			);
		}

		$scope.isLogged = function(){
			apiService.logged()
	  			.then(function(data) {    
	  				console.log(data);
	  				if (data.data.status == "NOT LOGGED"){
	  					$scope.showRegister = true;
	        			$scope.userImage = false;
	        			$scope.nombre = "";
	        			$scope.photo = 	"./img/default-user.png";
	        		}
	        		else{
	        			console.log(data.data);
	        			$scope.showRegister = false;
	        			$scope.userImage = true;
	        			$scope.photo = data.data.data.foto;
	        			$scope.nombre = data.data.data.nombre;
	        			$scope.carrito = data.data.data.carrito;
						$scope.carritoSize = data.data.data.carritoSize;
	        		}   
	  			}, function() {  
	  				console.log("ERROR");  
	  			});  
		}

		$scope.tryLogin = function(){
			apiService.login($scope.emailLogin, $scope.contraLogin)
  				.then(function(data) {    
  					console.log(data);
  					if (data.data.status != "SUCCESS"){
  						console.log("ERROR");
  						console.log(data);
        			}
        			else{
        				$(registrarseModal).modal('hide');
        				$scope.showRegister = false;
        				$scope.userImage = true;
        				$scope.photo = data.data.data.photo;
        				$scope.nombre = data.data.data.nombre;
        			}
        			$scope.emailLogin = "";
        			$scope.contraLogin = "";
  				}
  				, function() {
  					console.log("ERROR"); 
  				});
		}

		$scope.tryLogout = function(){
			apiService.logout()
	  			.then(function(data) {    
	  				console.log(data); 
	  				$scope.isLogged();	
	  			}, function() {  
	  				console.log("ERROR");  
	  			});  
		}

		$scope.reg = function() {
  			var allowed = true;

			if ($scope.contra.length < 8){
				alert("La longitud de la contraseña debe ser de mínimo 8 dígitos");
				allowed = false;
			}
			if ( allowed != false && $scope.contra != $scope.contra2){
				alert("Las contraseñas deben ser iguales");
				allowed = false;
			}
			if (allowed === true){
				if ($scope.photoInput == null || $scope.photoInput == undefined || $scope.photoInput == "")
					$scope.photoInput = "img/default-user.png"
	  			
	  			apiService.register($scope.nombreInput, $scope.apellidoInput, $scope.emailInput, $scope.celular, $scope.contra, $scope.photoInput)
	  				.then(function(data) {    
	  					console.log(data);
	  					if (data.data.stat == "ERROR"){
	        				if (data.data.data == "ER_DUP_ENTRY")
	        					alert("El correo que has ingresado ya se encuentra registrado.");
	        				else
	        					alert("Ha ocurrido un error, por favor intenta registrarte de nuevo.");
	        			}
	        			else{
	        				$(registrarseModal).modal('hide');
	        				$scope.showRegister = false;
	        				$scope.userImage = true;
	        				$scope.photo = data.data.data.photo;
	        				$scope.nombre = data.data.data.name;
	        			}  
	  				}
	  				, function() {
	  					console.log("ERROR"); 
	  				});
	  		}
  		} 
	});
