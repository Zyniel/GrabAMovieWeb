angular.module('MyApp')
  .factory('Movie', ['$resource', 'cfg', function($resource, cfg) {
    var Movie = $resource('/api/movies/:_id');
 
    Movie.prototype.getImg = function(imgType) {
        var path, ext;
        if (imgType === "poster") {
            path = cfg.path_posters;
            ext  = cfg.ext_posters;
        } else if (imgType === "mini") {
            path = cfg.path_minis;
            ext  = cfg.ext_minis;
        } else if (imgType === "tiny") {
            path = cfg.path_tinies;
            ext  = cfg.ext_tinies;
        } else { return null; }
        return path + this.imagenoext + ext;
    };

    Movie.prototype.getPosterImg = function () {
        return  this.getImg("poster");
    };
    
    Movie.prototype.getMiniImg = function () {
        return  this.getImg("mini");
    };    
    
    Movie.prototype.getTinyImg = function () {
        return  this.getImg("tiny");
    };    
    
    return Movie;
    
  }]);