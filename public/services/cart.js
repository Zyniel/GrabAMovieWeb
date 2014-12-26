angular.module('MyApp')
        .factory('Cart', ['$alert', '$rootScope', function($alert, $rootScope) {
        var cartReturn = {};

        cartReturn.currentUser = function() {
            return ($rootScope.currentUser) ? $rootScope.currentUser.email : "anonymous";
        };
        
        cartReturn.addItem = function(id, name) {
            var item = new CartItem(id, name);
            _cart.addItem(item);
        };
        
        cartReturn.removeItem = function(id, name) {
            var item = new CartItem(id, name);
            _cart.removeItem(item);
        };
        
        cartReturn.clearItems = function() {
            _cart.clearItems();
        };
        
        cartReturn.checkout = function(checkoutService) {
            _cart.saveItems();
            
        };

        cartReturn.loadItems = function() {
            _cart.name = this.currentUser();
            _cart.loadItems();
        };

        var cartName = cartReturn.currentUser();
        var _cart = new ShoppingCart(cartName);

        return cartReturn;
    }
]);

// 099355