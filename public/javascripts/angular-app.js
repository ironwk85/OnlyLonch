
angular.module('indexApp',['indexApp.controllers']);

angular.module('foodlistsApp',['foodlistsApp.controllers','sessionApp.controllers'])
	.factory('apiService', function($http) {  
		return {    
			register: function(n, a, em, cel, con, ph) {
				con = CryptoJS.SHA1(con);
				return $http.post('/register',{nombre:n, apellido:a, email:em, celular:cel, contra:con, photo:ph})
					.then(function(response) { 
						return response; 
					});    
			},  
			logged: function(){
				return $http.get('/activeSession')
					.then(function(response){
						return response;
					});
			}
		}
	}); 

angular.module('sessionApp',['sessionApp.controllers'])
	.factory('apiService', function($http) {  
		return {    
			register: function(n, a, em, cel, con, ph) {
				con = CryptoJS.SHA1(con).toString();
				return $http.post('/register',{nombre:n, apellido:a, email:em, celular:cel, contra:con, photo:ph})
					.then(function(response) { 
						return response; 
					});    
			},  
			logged: function(){
				return $http.get('/activeSession')
					.then(function(response){
						return response;
					});
			}
		}
	}); 