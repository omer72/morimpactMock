angular.module("morimpact").directive('goal', function () {
    return {
        restrict: "EA",
        replace: false,
        scope: {
            showgoal : "=",
            selectedgoal : "=",
            user : "="
        },
        templateUrl: 'client/goal/directive/goal.ng.html',
        link: function (scope, element, attrs, ngModel) {
            console.log("goal init ",scope.selectedgoal);
            console.log("goal init ",scope.user);


        },
        controller:function($scope,$rootScope,$reactive){
            console.log("goal initC");

            $reactive(this).attach($scope);
            this.subscribe('goalsCalcData');
            $scope.helpers({
                    goalsCalcData: () => {
                        return GoalsClacData.find({clientSystemId: parseInt($scope.user)});
                    }
            });

            console.log("goalsCalcData ",$scope.goalsCalcData);


            //TODO : fix porogress
            //$('#progress').progress({
            //    percent: ($scope.goalsCalcData[0].totalPoints/$scope.selectedgoal.tragetAwaredPoints)*100
            //});

        }
    }
})
