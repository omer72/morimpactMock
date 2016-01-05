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
        controller:function($scope,$rootScope,$reactive,$timeout) {
            console.log("goal initC");
            $scope.Math = window.Math;
            $reactive(this).attach($scope);
            this.subscribe('goalsCalcData');
            $scope.helpers({
                    goalsCalcData: () => {
                        return GoalsClacData.find({$and:[{goalId: $scope.selectedgoal._id},{clientSystemId: parseInt($scope.user)}]});
                    }
            });


            var updateProgress = function () {
                console.log("updateProgress ", $scope.goalsCalcData);
                $('#progress').progress({
                    percent: ($scope.goalsCalcData[0].totalPoints / $scope.selectedgoal.targetAwaredPoints) * 100
                });

            }
            $timeout(updateProgress, 1000);
        }
    }
})
