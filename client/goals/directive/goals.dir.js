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
            $scope.goal.points = {points:50,rank:7};
            $scope.goal.ranges = [{points:50,from:7,to:8,tag:'image',test:''}];
            $scope.fields = [
                {id:"sales",name:"מכירות"},
                {id:"talksLength",name:"אורך שיחה"},
                {id:"professional",name:"שביעות רצון לקוח"}
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


            $scope.addRange = function(){
                if ($scope.goal.ranges.length < 2)
                    $scope.goal.ranges.push({points:50,from:7,to:8,tag:'image',test:''});
            };

            $scope.deleteRange = function(value){
                if ($scope.goal.ranges.length >1) {
                    for (var i = 0; i < $scope.goal.ranges.length; i++) {
                        if (value.$$hashKey == $scope.goal.ranges[i].$$hashKey) {
                            delete $scope.goal.ranges[i];
                            $scope.goal.ranges = _.compact($scope.goal.ranges);
                            return;
                        }
                    }
                }
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

            $scope.finish = function(){
                console.log("OnFinish Done");
            }

            $scope.getWorkingDays = function(){
                var result = 0;

                var currentDate = angular.copy($scope.goal.startDate);
                while (currentDate <= $scope.goal.endDate)  {

                    var weekDay = currentDate.getDay();
                    if(weekDay != 5 && weekDay != 6)
                        result++;

                    currentDate.setDate(currentDate.getDate()+1);
                }

                $scope.calenderTimeLength =  result;
            }


        }
    }
})
