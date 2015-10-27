angular.module("morimpact").directive('dropdown', ['$timeout', function ($timeout) {
    return {
        restrict: "EA",
        replace: true,
        scope: {
            ngModel: '=',
            data: '=',
            name:'@'
        },
        template: '<div class="ui selection dropdown"><input type="hidden" name="id"><div class="default text">{{name}}</div><i class="dropdown icon"></i><div class="menu"><div class="item" ng-repeat="item in data" data-value="{{item.id}}">{{item.name}}</div></div></div>',
        link: function (scope, elm, attr) {
            var changeBound = false;
            elm.dropdown({
                onShow: function() {
                    if(!changeBound) {
                        console.log('binding change');
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
            });
        }
    };
}]);