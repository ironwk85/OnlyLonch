
angular.module('coberturaApp.controllers',[])
	.controller('coberturaController' , function($rootScope, $scope, $http, apiService){  
		$scope.sendCoberturaEmail = function(id,elem) {
			var subject = "Sentimos que no haya cobertura";
			var message = "Nuestras más sinceras disculpas";
			var htmlMessage = "<b>Nuestras más sinceras disculpas</b>";
			apiService.sendEmail($scope.emailInput,subject,message,htmlMessage)
  				.then(function(data) {    
  					console.log(data);
  					if (data.data.status == "ERROR"){
  						console.log("ERROR");
  						alert("Hubo un error, inténtalo de nuevo.");
        			}
        			else{
        				console.log("SUCCESS");
        				alert("Gracias por visitarnos, te avisaremos cuando tengamos nuevas áreas de cobertura.");
        			}
  				}
  				, function() {
  					console.log("ERROR"); 
  					alert("Error, por favor intente de nuevo");
  				});
		}

		$scope.getDir = function() {
			apiService.getDirecciones()
  				.then(function(data) {    
  					console.log(data);
  					if (data.data.status == "ERROR"){
  						console.log("ERROR");
        			}
        			else{
        				console.log("SUCCESS");
        			}
  				}
  				, function() {
  					console.log("ERROR");
  				});
		}
	});
