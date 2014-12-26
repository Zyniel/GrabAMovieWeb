angular.module('MyApp')
        .controller('MainCtrl', ['$scope', 'Movie', 'Library', 'cfg', 'Cart', function($scope, Movie, Library, cfg, Cart) {

        // Keep genuine alphabet until International Sorting Algorithm coded
        $scope.alphabet = ['0-9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
            'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
            'Y', 'Z', '#'];
        /*
        $scope.genres = ['Action', 'Adventure', 'Animation', 'Children', 'Comedy',
            'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'Food',
            'Home and Garden', 'Horror', 'Mini-Series', 'Mystery', 'News', 'Reality',
            'Romance', 'Sci-Fi', 'Sport', 'Suspense', 'Talk Show', 'Thriller',
            'Travel'];
        */
        // $scope.alphabet =  Library.alphabet.query();
        $scope.genres = Library.genres.query();
       
        $scope.headingTitle = 'Top 12 Movies';

        $scope.movies = Movie.query();

        $scope.cfg = cfg;
        cfg.posters = (cfg.posters && cfg.posters !== "") ? (cfg.posters + '/').replace(/\/+/gi, "/") : "";

        $scope.filterByGenre = function(genre) {
            $scope.movies = Movie.query({genre: genre});
            $scope.headingTitle = genre;
        };

        $scope.filterByAlphabet = function(char) {
            $scope.movies = Movie.query({alphabet: char});
            $scope.headingTitle = char;
        };

        $scope.filterByRating = function(char) {
            $scope.movies = Movie.query({alphabet: char});
            $scope.headingTitle = char;
        };

        $scope.loadMore = function() {
        };

        $scope.addToCart = function(movie) {
            console.log('Adding : "' + movie.title + '" to cart ...');
            var item = new CartItem(movie._id, movie.title);
            Cart.addItem(item);
        };

    }]);