angular.module('MyApp')
    .directive("starrating", [ 'cfg', function (cfg) {
	return {
                restrict: 'A',            
		link: function (scope, elem) {
                        var rtgConf = cfg.star_rating || {};
			$(elem).rating('refresh', rtgConf);
		}
	};
}]);