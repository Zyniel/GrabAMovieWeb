angular.module('MyApp')
  .controller('CartCtrl', ['$scope', 'Cart', 'Movie','cfg', function($scope, Cart, MovieService, cfg) {
    
    $scope.cart = Cart;
    $scope.cfg = cfg;
    $scope.getFormattedtRtg = function(rating) {
        return rating.toPrecision(2);
    };
    $scope.getFormattedtMaxRtg = function() {
        return cfg.star_rating.max;
    };    
    
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
    }
    $scope.movies = movies;
  }]);