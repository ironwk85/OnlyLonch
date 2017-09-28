
angular.module('sessionApp.controllers', [])
	.controller('mainController', function($rootScope, $scope, apiService) {  
  		$scope.emailInput = "";
		$scope.nombreInput = "";
		$scope.apellidoInput = "";
		$scope.photoInput = "";
		$scope.showRegister = false;
		$scope.userImage = false;

  		$scope.tryLoginFacebook = function() {
  			$scope.emailInput = "";
			$scope.nombreInput = "";
			$scope.apellidoInput = "";
			$scope.photoInput = "";

	    	FB.login(function(response) {
				if (response.status === 'connected') {
					FB.api('/me', {fields: 'email'}, function(response) {
						console.log(response);
						apiService.loginFacebook(response.email)
				  			.then(function(data) {    
				  				console.log(data);
			  					if (data.data.status == "NOT LOGGED"){
			  						console.log("ERROR");
			  						console.log(data);
			  						alert("Usuario no encontrado");
			        			}
			        			else if (data.data.status == "SUCCESS"){
			        				$(registrarseModal).modal('hide');
			        				$scope.showRegister = false;
			        				$scope.userImage = true;
			        				$scope.photo = data.data.data.foto;
			        				$scope.nombre = data.data.data.nombre;
			        				$scope.emailLogin = "";
			        				$scope.contraLogin = "";
			        			}
			        			else{
			        				console.log("ERROR");
			  						console.log(data);
			  						alert("Error, por favor intente de nuevo");
			        			}  
				  			}, function() {  
				  				console.log("ERROR");  
				  				alert("Error, por favor intente de nuevo");
				  			});  
					});
				} 
				else if (response.status === 'not_authorized')
			    	console.log("No se autorizó a Facebook");
				else
			    	console.log("No se ha podido ingresar con Facebook");
			}
			,{scope: 'public_profile,email,user_birthday'}
			);
		}

		$scope.getInfoFacebook = function() {
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
			    	console.log("No se autorizó a Facebook");
				else
			    	console.log("No se ha podido ingresar con Facebook");
			}
			,{scope: 'public_profile,email,user_birthday'}
			);
		}

		$scope.isLogged = function(){
			$rootScope.carrito = [];
			$rootScope.carritoSize = 0;
			$scope.getFace = true;
			$scope.loginFace = false;
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
	        			$rootScope.carrito = data.data.data.carrito;
						$rootScope.carritoSize = data.data.data.carritoSize;

						console.log("-------------Carrito network---------------------------");
						console.log($rootScope.carrito);
						console.log(typeof $rootScope.carrito);
						console.log("----------------------------------------");
	        		}   
	  			}, function() {  
	  				console.log("ERROR");  
	  			});  
		}

		$scope.tryLogin = function(){
			var allowed = true;

			if ($scope.emailLogin==null || $scope.emailLogin.length<=0)
  				allowed = false;
  			if (allowed != false && ($scope.contraLogin==null || $scope.contraLogin.length<=0))
  				allowed = false;

			if (allowed){
				apiService.login($scope.emailLogin, $scope.contraLogin)
	  				.then(function(data) {    
	  					console.log(data);
	  					if (data.data.status == "NOT FOUND"){
	  						console.log("ERROR");
	  						console.log(data);
	  						alert("Usuario no encontrado y/o contraseña incorrecta");
	        			}
	        			else if (data.data.status == "SUCCESS"){
	        				$(registrarseModal).modal('hide');
	        				$scope.showRegister = false;
	        				$scope.userImage = true;
	        				$scope.photo = data.data.data.foto;
	        				$scope.nombre = data.data.data.nombre;
	        				$scope.emailLogin = "";
	        				$scope.contraLogin = "";
	        			}
	        			else{
	        				console.log("ERROR");
	  						console.log(data);
	  						$scope.emailLogin = "";
	        				$scope.contraLogin = "";
	        				alert("Error, por favor intente de nuevo");
	        			}
	  				}
	  				, function() {
	  					console.log("ERROR"); 
	  					alert("Error, por favor intente de nuevo");
	  				});
  			}
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

  			if ($scope.nombreInput==null || $scope.nombreInput.length<=0)
  				allowed = false;
  			if (allowed != false && ($scope.apellidoInput==null || $scope.apellidoInput.length<=0))
  				allowed = false;
  			if (allowed != false && ($scope.emailInput==null || $scope.emailInput.length<=0))
  				allowed = false;
  			if (allowed != false && ($scope.celular==null || $scope.celular.length<=0))
  				allowed = false;
			if (allowed != false && ($scope.contra==null || $scope.contra.length < 8))
				allowed = false;
			if ( allowed != false && $scope.contra!=$scope.contra2){
				alert("Las contraseñas deben ser iguales");
				allowed = false;
			}
			if (allowed === true){
				if ($scope.photoInput == null || $scope.photoInput == undefined || $scope.photoInput == "")
					$scope.photoInput = "img/default-user.png"
	  			
	  			apiService.register($scope.nombreInput, $scope.apellidoInput, $scope.emailInput, $scope.celular, $scope.contra, $scope.photoInput)
	  				.then(function(data) {    
	  					
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
	        				$scope.photo = data.data.data.foto;
	        				$scope.nombre = data.data.data.nombre;
	        				console.log("****************Datos despues registro****************************");
	        				console.log(data.data.data);
	        				console.log("****************Datos despues registro****************************");
	        			}  
	  				}
	  				, function() {
	  					console.log("ERROR"); 
	  				});
	  		}
  		} 
	});
