angular.module("morimpact").directive('dropdownsearch', ['$timeout', function ($timeout) {
    return {
        restrict: "EA",
        replace: true,
        scope: {
            ngModel: '=',
            data: '=',
            name:'@'
        },
        templateUrl: 'client/directives/dropdownSearch.ng.html',
        link: function (scope, elm, attr) {
            console.log("dropdownSearch");
            // initialize the dropdown after angular is completely done
            // digesting this directive
            $timeout(function() {
                elm.dropdown({
                    onChange: function(newValue) {
                        // this function is executed outside of angular's
                        // digest loop so in order to notify angular about
                        // changes to the model you need to use $apply
                        scope.$apply(function(scope) {
                            scope.ngModel = newValue;
                        });
                    }
                });
                elm.search({
                    onChange: function(newValue) {
                        // this function is executed outside of angular's
                        // digest loop so in order to notify angular about
                        // changes to the model you need to use $apply
                        scope.$apply(function(scope) {
                            scope.ngModel = newValue;
                        });
                    }
                });
            });
        }
    };
}])/**
 * Created by oetrog on 9/9/15.
 */
