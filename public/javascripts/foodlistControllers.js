
angular.module('foodlistsApp.controllers',[])
	.controller('CarousellController' , function($scope){  
		$scope.image1='./img/carousel1.png';
		$scope.image2='./img/carousel1.png';
		$scope.image3='./img/carousel1.png';
	})
	.controller('FoodlistsController' , function($scope, $http){  
		$scope.contents = null;
		$scope.orange = ["","","","",""];
		$scope.carrito = [];
		$scope.carritoSize = 0;
		foodlist = -1;
		dateIndex = -1
		openElement = -1;
		counter = 0;
    	
    	/*Foodlists JSON*/
    	$http.get('javascripts/jsons/foodlists.json')
    		.success(function(data, status, headers, config) {$scope.contents=data;})
	        .error(function(data, status, headers, config) {});

        $scope.toggle = function(id,elem) {
        	var elemToShow= "event:toggleRow" + elem
        	console.log(elemToShow);
        	if (openElement == -1){
        		$scope.$broadcast(elemToShow);
        		openElement = id;
        		counter++;
        	}
        	else if (openElement == id){
        		$scope.$broadcast(elemToShow);
        		openElement = id;
        		counter++;
        	}
        	else{
        		if (counter%2==0)
        			$scope.$broadcast(elemToShow);
        		openElement = id;
        		counter = 1;
        	}
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
	        	})
	        	.error(function(data, status, headers, config) {});
		}

		$scope.addedElement = function(){
			$scope.foods.total = $scope.total.t;
			$scope.carrito.push($scope.foods);
			$scope.carritoSize = $scope.carrito.length;
			console.log($scope.carrito);
		}

		$scope.increaseTotal = function(select){
			  if (select.s%2 == 0){
			  	$scope.total.t = $scope.total.t + 10;
			  } 
			  else{
			  	$scope.total.t = $scope.total.t - 10;
			  }
			  select.s++;
		}
	})
	.directive('toggleRow1', function() {
    	return function(scope, elem, attrs) {
        	scope.$on('event:toggleRow1', function() {
            	elem.slideToggle();
        	});
    	};
	});
