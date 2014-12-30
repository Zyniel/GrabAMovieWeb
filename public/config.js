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
                 disabled: true, 
                 showClear: false, 
                 showCaption: false, 
                 size : "xs", 
                 step : 0.1, 
                 min: 0,
                 max: 10,
                 stars: 5,
                 readonly: true
            }
        }
);