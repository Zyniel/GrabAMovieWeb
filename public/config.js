angular.module('MyApp')
        .constant('cfg',
        {
            path_posters    : "images/posters/",
            path_minis      : "images/minis/",
            path_tinies     : "images/tinies/",
            ext_posters     : "'-poster.jpg",
            ext_minis       : "-mini.jpg",
            ext_tinies      : "-tiny.jpg",
            
            star_rating : {
                 showClear: false, 
                 showCaption: false, 
                 size : "xs", 
                 step : 0.25, 
                 min: 0,
                 max: 5,
                 stars: 10,
                 readonly: false
            }
        }
);