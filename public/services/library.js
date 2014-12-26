angular.module('MyApp')
  .factory('Library', ['$resource', '$http', function($resource, $http) {
      return {
        genres   : $resource('/api/library/genres'),
        alphabet : $resource('/api/library/alphabet')
      };
  }]);