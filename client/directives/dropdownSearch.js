angular.module("morimpact").directive('dropdownsearch', ['$timeout', function ($timeout) {
    return {
        restrict: "EA",
        replace: true,
        scope: {
            ngModel: '=',
            data: '=',
            name: '@'
        },
        template: '<div class="ui fluid search selection dropdown" style="text-align: right;border-radius: 500rem;width: 550px !important;"><input type="hidden" name="clientSystemId" style="text-align: right"><i class="search icon"></i><div class="default text">{{name}}</div><div class="menu"><div class="item" data-value="{{item.name}}" ng-repeat="item in data" style="text-align: right">{{item.name}}</div> </div> </div>',
        link: function (scope, elm, attr){
            var changeBound = false;
            elm.dropdown({
                onShow: function() {
                    if(!changeBound) {
                        console.log('binding change dropdown');
                        elm.dropdown({
                            onChange: function(value) {
                                scope.$apply(function(scope) {
                                    scope.ngModel = value;
                                });
                            }
                        })
                        changeBound = true;
                    }
                }
            }),
            elm.focus({
                onFocus: function() {
                    if(!changeBound) {
                        console.log('binding change focus');
                        elm.search({
                            onFocus: function(value) {
                                scope.$apply(function(scope) {
                                    scope.ngModel = value;
                                });
                            }
                        })
                        changeBound = true;
                    }
                }
            });
        }
    };
}]);



//angular.module("morimpact").directive('dropdownsearch', ['$timeout', function ($timeout) {
//    return {
//        restrict: "EA",
//        replace: true,
//        scope: {
//            ngModel: '=',
//            data: '=',
//            name:'@'
//        },
//        templateUrl: 'client/directives/dropdownSearch.ng.html',
//        link: function (scope, elm, attr) {
//            console.log("dropdownSearch");
//            // initialize the dropdown after angular is completely done
//            // digesting this directive
//            $timeout(function() {
//                elm.dropdown({
//                    onChange: function(newValue) {
//                        // this function is executed outside of angular's
//                        // digest loop so in order to notify angular about
//                        // changes to the model you need to use $apply
//                        scope.$apply(function(scope) {
//                            scope.ngModel = newValue;
//                        });
//                    }
//                });
//                elm.search({
//                    onChange: function(newValue) {
//                        // this function is executed outside of angular's
//                        // digest loop so in order to notify angular about
//                        // changes to the model you need to use $apply
//                        scope.$apply(function(scope) {
//                            scope.ngModel = newValue;
//                        });
//                    }
//                });
//            });
//        }
//    };
//}])/**
// * Created by oetrog on 9/9/15.
// */
