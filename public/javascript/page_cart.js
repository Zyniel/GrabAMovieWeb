(function($){
    $( "#cart div.panel > span.rating").on("change", function() {
        $( this ).rating(['min'=>1, 'max'=>5, 'step'=>5]);
    });
})(jQuery);