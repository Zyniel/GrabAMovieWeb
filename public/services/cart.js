angular.module('MyApp')
        .factory('Cart', ['$alert', '$rootScope', function($alert, $rootScope) {
        var cartReturn = {};

        cartReturn.currentUser = function() {
            return ($rootScope.currentUser) ? $rootScope.currentUser.email : "anonymous";
        };
        
        cartReturn.addItem = function(item) {
            if (item instanceof CartItem) {
                //var item = new CartItem(id, name);
                _cart.addItem(item);
            } else {
                console.error("Could not add item.");
            }
        };
        
        cartReturn.removeItem = function(item) {
            if (item instanceof CartItem) {
                //var item = new CartItem(id, name);
                _cart.removeItem(item);
            } else {
                console.error("Could not remove item.");
            }
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
        
        cartReturn.isEmpty = function () {
            return !(_cart.items.length > 0);
        };
        
        cartReturn.getCount = function () {
            return _cart.items.length;
        };
        
        cartReturn.contains = function(item) {
            if (item instanceof CartItem) {
                return _cart.contains(item);
            }
            return false;
       }
       
       cartReturn.items = function () {
         return _cart.items; 
       };
        
        var cartName = cartReturn.currentUser();
        var _cart = new ShoppingCart(cartName);

        return cartReturn;
    }
]);

// 099355