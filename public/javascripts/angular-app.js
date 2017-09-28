
angular.module('indexApp',['indexApp.controllers']);

angular.module('foodlistsApp',['foodlistsApp.controllers','sessionApp.controllers'])
	.factory('apiService', function($http) {  
		return {    
			register: function(n, a, em, cel, con, ph) {
				con = CryptoJS.SHA1(con).toString();
				return $http.post('/register',{nombre:n, apellido:a, email:em, celular:cel, contra:con, photo:ph})
					.then(function(response) { 
						return response; 
					});    
			},
			login: function(em, p) {
				p = CryptoJS.SHA1(p).toString();
				return $http.post('/login',{email:em, password:p})
					.then(function(response) { 
						return response; 
					});    
			},
			loginFacebook: function(em) {
				return $http.post('/loginFacebook',{email:em})
					.then(function(response) { 
						return response; 
					});    
			},
			logout: function(){
				return $http.get('/logout')
					.then(function(response){
						return response;
					});
			},
			logged: function(){
				return $http.get('/activeSession')
					.then(function(response){
						return response;
					});
			},
			updateCart: function(c, cs, t){
				return $http.post('/updateCart',{carrito:c,carritoSize:cs,total:t})
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
			login: function(em, p) {
				p = CryptoJS.SHA1(p).toString();
				return $http.post('/login',{email:em, password:p})
					.then(function(response) { 
						return response; 
					});    
			},
			loginFacebook: function(em) {
				return $http.post('/loginFacebook',{email:em})
					.then(function(response) { 
						return response; 
					});    
			},
			logout: function(){
				return $http.get('/logout')
					.then(function(response){
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