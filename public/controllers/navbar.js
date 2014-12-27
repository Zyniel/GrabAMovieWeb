angular.module('MyApp')
  .controller('NavbarCtrl', ['$scope', 'Auth', 'Cart',  function($scope, Auth, Cart) {
    $scope.logout = function() {
      Auth.logout();
    };
    
    $scope.cart = Cart;
    
  }]);