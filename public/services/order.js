angular.module('MyApp')
  .factory('Order', ['$resource', function($resource) {
    return $resource('/api/orders/:_id');
  }]);