
angular.module('foodlistsApp.controllers',[])
	.controller('CarousellController' , function($scope){  
		$scope.image1='./img/carousel1.png';
		$scope.image2='./img/carousel1.png';
		$scope.image3='./img/carousel1.png';
	})
	.controller('FoodlistsController' , function($rootScope, $scope, $http, apiService){  
		$scope.contents = null;
		$scope.orange = ["","","","",""];
		foodlist = -1;
		dateIndex = -1
		openElement = -1;
		openRow = -1;
		counter1 = 0;
		counter2 = 0;
    	
    	/*Foodlists JSON*/
    	$http.get('javascripts/jsons/foodlists.json')
    		.success(function(data, status, headers, config) {$scope.contents=data;})
	        .error(function(data, status, headers, config) {});

        $scope.toggle = function(id,elem) {
        	var elemToToggle = "event:toggleRow" + elem;

        	if (openElement == id && openRow == elem){
        		$scope.$broadcast(elemToToggle);
        		openElement = id;
        		openRow = elem
        		if (elem == 1)
        			counter1++;
        		else
        			counter2++;
        	}
        	else if (openRow!=-1 && openRow!= elem){
        		if (elem == 1){
        			if (counter1%2 == 0)
        				$scope.$broadcast("event:toggleRow1");
        			if (counter2%2 == 1){
        				$scope.$broadcast("event:toggleRow2");
        				counter2++;
        			}
        			counter1++;
        		}
        		else{
        			if (counter2%2 == 0)
        				$scope.$broadcast("event:toggleRow2");
        			if (counter1%2 == 1){
        				$scope.$broadcast("event:toggleRow1");
        				counter1++;
        			}
        			counter2++;
        		}
        		openElement = id;
        		openRow = elem
        	}
        	else if (openRow == -1){
        		$scope.$broadcast(elemToToggle);
        		openElement = id;
        		openRow = elem
        		if (elem == 1)
        			counter1++;
        		else
        			counter2++;
        	}
        	else{
        		openElement = id;
        		openRow = elem
        	}
        	console.log(counter1+"++++++++++++++++++++++++++++++++");
        	console.log(counter2+"++++++++++++++++++++++++++++++++");
	    }

		$scope.orangeStyle = function(id){
			if (dateIndex == id)
				return "orange_upperline";
			return	"";
		}

        $scope.getItem = function (id){
	        $http.get('javascripts/jsons/foodlists.json')
	        	.success(function(data, status, headers, config) {
	        		var today = new Date();
					var dd = today.getDate();
					var mm = today.getMonth()+1; //January is 0
					var yyyy = today.getFullYear();
					foodlist = id;

					if(dd<10)
				    	dd='0'+dd 

					if(mm<10)
						mm='0'+mm

					today = dd+'/'+mm+'/'+yyyy;
					today = '28/08/2017';
				
					for (var i=0; i< data[0].foodlists[id].programacion.length; i++){
						if (today.localeCompare(data[0].foodlists[id].programacion[i].fechaId) == 0){
							$scope.foods = data[0].foodlists[id].programacion[i];
							$scope.selectedFoodlist = data[0].foodlists[id].idFoodist;
							$scope.selectedFoodlistFood = data[0].foodlists[id].programacion[i].titulo;
							$scope.selectedFoodlistName = data[0].foodlists[id].titulo;
							$scope.total = {t:($scope.foods.precio)};
							$scope.orange = ["","","","",""];
							$scope.orange[i] = "orange_upperline";
							console.log(i);
							console.log($scope.orange);
							dateIndex = i;
							console.log($scope.foods);
							break;
						}
					}
	        	})
	        	.error(function(data, status, headers, config) {});
		}

		$scope.getItemAtDate = function (id,d){
			$http.get('javascripts/jsons/foodlists.json')
				.success(function(data, status, headers, config) {
					$scope.foods=data[0].foodlists[foodlist].programacion[d];
					$scope.total = {t:($scope.foods.precio)};
					$scope.orange = ["","","","",""];
					$scope.orange[d] = "orange_upperline";
					$scope.selectedFoodlist = data[0].foodlists[foodlist].idFoodist;
					$scope.selectedFoodlistFood = data[0].foodlists[foodlist].programacion[d].titulo;
					$scope.selectedFoodlistName = data[0].foodlists[foodlist].titulo;
	        	})
	        	.error(function(data, status, headers, config) {});
		}

		$scope.addedElement = function(){

			console.log("-------------Carrito antes---------------------------");
			console.log($rootScope.carrito);
			console.log("----------------------------------------");

			$scope.foods.total = $scope.total.t;
			$rootScope.carrito.push({foodlist:$scope.selectedFoodlist,name:$scope.selectedFoodlistName,food:$scope.selectedFoodlistFood,fechaId:$scope.foods.fechaId,extras:$scope.total.extras,total:$scope.foods.total});
			$rootScope.carritoSize = $scope.carrito.length;

			console.log("-------------Carrito despues---------------------------");
			console.log($rootScope.carrito);
			console.log("----------------------------------------");

			apiService.updateCart($rootScope.carrito, $rootScope.carritoSize)
  				.then(function(data) {    
  					console.log(data);
  				}
  				, function() {
  					console.log("ERROR"); 
  				});
		}

		$scope.increaseTotal = function(select){
			  if (select.s%2 == 0){
			  	$scope.total.t = $scope.total.t + 10;
			  	select.s++;
			  	$scope.total.extras.push(idExtra);
			  } 
			  else{
			  	$scope.total.t = $scope.total.t - 10;
			  	select.s--;
			  	for (var i=0; i<$scope.total.extras.length; i++){
			  		if (i == idExtra[i])
			  			$scope.total.extras.splice(i,1);
			  	}
			  }
		}
	})
	.directive('toggleRow1', function() {
    	return function(scope, elem, attrs) {
        	scope.$on('event:toggleRow1', function() {
            	elem.slideToggle();
        	});
    	};
	})
	.directive('toggleRow2', function() {
    	return function(scope, elem, attrs) {
        	scope.$on('event:toggleRow2', function() {
            	elem.slideToggle();
        	});
    	};
	});

