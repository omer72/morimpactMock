angular.module("morimpact").directive('choosetag', chooseTag);

function chooseTag() {
    return {
        restrict: "EA",
        replace: false,
        scope: {
            selectedTagVisual : '=',
            showSelectTagState : "="
        },
        templateUrl: 'client/directives/chooseTag.ng.html',

        link: function(scope, element, attrs, ngModel, transclude) {
            console.log("chooseTag link");
            scope.range = _.range(1, 13);
        },
        controller:function($scope,$rootScope){
            console.log("chooseTag contoller");

            $scope.selectedTagVisualMenu = "030205FirgunimInnerPagesElements_addBagdeLARGE_full_124x124";

            $scope.$watch('$scope.selectedTagVisual',function(newValue,oldValue){
                console.log(newValue + " "+oldValue);
            })
            $scope.selectedTag = function(value){
                value +=1;
                if (value<10){
                    value = "0"+value;
                }
                $scope.selectedTagVisual.tag = "0303"+value+"FirgunimInnerPagesElements_Bages71x71";
                $scope.selectedTagVisualMenu = "0304"+value+"FirgunimInnerPagesElements_LargeBages126x126";
            };

            $scope.cancelSelectedTag = function(){
                $scope.selectedTagVisual.tag = '030204FirgunimInnerPagesElements_addBagdeFull48x38';
                $scope.selectedTagVisualMenu = "030205FirgunimInnerPagesElements_addBagdeLARGE_full_124x124";
            }

            $scope.addSelectedTag = function(){
                console.log("showSelectTagState");
                $rootScope.showSelectTagState = false;
            }


        }
    };

}