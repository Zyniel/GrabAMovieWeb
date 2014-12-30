angular.module('MyApp')
  .controller('CartCtrl', ['$scope', 'Cart', 'Movie', function($scope, Cart, MovieService) {
    
    $scope.cart = Cart;
    
    // Get Movies Information
    var items = Cart.items();
    var iMax = items.length;
    var movies = [];
    
    for (i = 0; i < iMax; i++) {
        try {
            var id = items[i].id;
            if (id) {
                MovieService.get({_id : id}).$promise.then (function (movie){
                    movies.push (movie);
                });
            } 
        }
        catch (e) {
           console.error("Error fetching movie data:" + e.toString());
        }
        
        $scope.movies = movies;
    }
  }]);