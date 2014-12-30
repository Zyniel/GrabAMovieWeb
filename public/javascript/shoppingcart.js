function ShoppingCart(name) {
    this.name = name;
    this.clearCart = false;
    this.checkoutParameters = {};
    this.items = [];

    // Loading items when initializing
    this.loadItems();

    // Save items to localstorage when unloading
    var self = this;
    $(window).unload(function() {
        if (self.clearCart) {
            self.clearItems();
        }
        self.saveItems();
        self.clearCart = false;
    });
}

ShoppingCart.prototype.loadItems = function() {
    var items = localStorage != null ? localStorage[this.name + "_items"] : null;
    if (items != null && JSON != null) {
        try {
            var items = JSON.parse(items);
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item.id != null && item.name != null) {
                    item = new cartItem(item.id, item.name, item.price);
                    this.items.push(item);
                }
            }
        }
        catch (err) {
            // ignore errors while loading...
        }
    }
};

ShoppingCart.prototype.saveItems = function() {
    if (localStorage != null && JSON != null) {
        localStorage.setItem(
                this.name + "_items",
                JSON.stringify(this.items)
                );
    }
};

// adds an item to the cart
ShoppingCart.prototype.addItem = function(item) {
    if (item instanceof CartItem) {
        // update quantity for existing item
        var found = false;
        for (var i = 0, len = this.items.length; i < len && !found; i++) {
            if (this.items[i].id === item.id) {
                found = true;
            }
        }

        // new item, add now
        if (!found) {
            this.items.push(item);
            console.log("Item added to the cart: " + item.name);

            // save changes
            this.saveItems();
        } else {
            console.warn("Could not add item to cart: Item already exists: " + item.name);
        }
    }
};

ShoppingCart.prototype.removeItem = function(item) {
    if (item instanceof CartItem) {
        var found = false;
        for (var i = this.items.length - 1; i >= 0; i--) {
            if (this.items[i].id === item.id) {
                this.items.splice(i, 1);
                found = true;
            }
        }

        // save changes
        if (found) {
            console.log("Removed item from cart: " + item.name);
            this.saveItems();
        } else {
            console.warn("Could not remove item from cart.");
        }
    }
};


ShoppingCart.prototype.clearItems = function() {
    this.items = [];

    // save changes
    this.saveItems();
};

ShoppingCart.prototype.checkout = function(checkoutService) {
};

ShoppingCart.prototype.contains = function (item) {
  return this.items.map(function(e) { return e.id; }).indexOf(item.id) >= 0;
};