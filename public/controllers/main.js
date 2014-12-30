angular.module('MyApp')
        .controller('MainCtrl', ['$scope', 'Movie', 'Library', 'Cart', function($scope, Movie, Library, Cart) {
       
        // Keep genuine alphabet until International Sorting Algorithm coded
        $scope.alphabet = ['0-9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '#'];
        // $scope.alphabet =  Library.alphabet.query();
        $scope.genres = Library.genres.query();
        // Setting Title
        $scope.headingTitle = 'Top 12 Movies';
        
        // Fetching first batch of movies
        $scope.movies = Movie.query();       

        // Functions
        $scope.filterByGenre = function(genre) {
            $scope.movies = Movie.query({genre: genre});
            $scope.headingTitle = genre;
        };

        $scope.filterByAlphabet = function(char) {
            $scope.movies = Movie.query({alphabet: char});
            if (char === "#") {
                $scope.headingTitle = 'Others';
            } else {
                $scope.headingTitle = 'Letter "' + char + '"';
            }            
        };

        $scope.filterByRating = function(rtg) {
            $scope.movies = Movie.query({alphabet: rtg});
            $scope.headingTitle = 'Rating';
        };

        $scope.loadMore = function() {
        };

        $scope.addToCart = function(movie) {
            console.log('Adding : "' + movie.title + '" to cart ...');
            var item = new CartItem(movie._id, movie.title);
            Cart.addItem(item);
        };
        
        $scope.removeFromCart = function(movie) {
            console.log('Removing : "' + movie.title + '" to cart ...');
            var item = new CartItem(movie._id, movie.title);
            Cart.removeItem(item);
        };        
        
        $scope.cartContains = function (movie){
            var item = new CartItem(movie._id, movie.title);
            return Cart.contains(item);
        };

    }]);