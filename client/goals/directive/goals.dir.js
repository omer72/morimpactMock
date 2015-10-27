angular.module("morimpact").directive('goals', function () {
    return {
        restrict: "EA",
        replace: false,
        scope: {
            showgoals : "=",
        },
        templateUrl: 'client/goals/view/goals.ng.html',

        link: function (scope, element, attrs, ngModel) {
            console.log("goals init");


        },
        controller:function($scope){
            console.log("goals initC");
            $scope.modalTitle = "ניהול יעדים";
            $scope.goal = {};
            $scope.fields = [
                {id:"sales",name:"מכירות"},
                {id:"generalExcellence",name:"הצטיינות כללית"},
                {id:"campaignExcellence",name:"הצטיינות בקמפיין (אתגר)"},
                {id:"talksLength",name:"אורך שיחה"},
                {id:"professional",name:"מקצועיות"},
                {id:"generalPoints",name:"ניקוד כללי"}
            ];
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
