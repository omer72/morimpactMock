angular.module("morimpact").directive('challenges', function () {
    return {
        restrict: "EA",
        replace: false,
        scope: {
            showchallenges : "=",
        },
        templateUrl: 'client/challenges/view/challenges.ng.html',

        link: function (scope, element, attrs, ngModel) {
            console.log("challenges init");


        },
        controller:function($scope){
            console.log("challenges initC");
            $scope.modalTitle = "ניהול אתגרי ידע";
            $scope.state = "Start";
            $scope.viewState = true;
            $scope.editState = false;
            $scope.stepNumber = 1;
            $scope.changeState = function(){
                if ($scope.state == "Start") {
                    $scope.state = "Selected";

                };
                //else {
                //    $scope.state = "Start";
                //    $scope.modalTitle = "ניהול אתגרי ידע";
                //}
            };

            $scope.changeStateManagement = function(){
                if ($scope.state == "Selected") {
                    $scope.modalTitle = "עריכת אתגר ידע";
                    $scope.viewState = false;
                    $scope.editState = true;
                    $scope.stepNumber = 1;
                }
            }

            $scope.exitEditStateFunction = function(){
                console.log('exitEditState');
                $scope.modalTitle = "ניהול אתגרי ידע";
                $scope.viewState = true;
                $scope.editState = false;
            }

            $scope.next = function(){
                if ($scope.stepNumber == 5) {
                    $scope.exitEditStateFunction();
                }
                $scope.stepNumber ++;
            }

            $scope.before = function(){
                if ($scope.stepNumber == 1)
                    return;
                $scope.stepNumber --;
            }

        }
    }
})
