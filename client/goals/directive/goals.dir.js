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
         controller:function($scope,$rootScope,$reactive,$element){
             $reactive(this).attach($scope);
             this.subscribe('goals');
             $scope.helpers({
                     goals: () => {
                     return Goals.find({},{sort: {startDate: 1}});
                    }
            });
            $rootScope.showSelectTagState = false;
            console.log("goals initC");
            $scope.modalTitle = "ניהול יעדים";
            $scope.selectedTagVisual = '030204FirgunimInnerPagesElements_addBagdeFull48x38';

            $scope.goal = {};

             $scope.fields = [
                {id:"1",name:"מכירות"},
                {id:"2",name:"אורך שיחה"},
                {id:"3",name:"שביעות רצון לקוח"}
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
            initGoal();

            function initGoal(){
                $scope.goal = {};
                $scope.goal.improv = {tag:'030204FirgunimInnerPagesElements_addBagdeFull48x38',name:'improvement'};
                $scope.goal.lead= {tag:'030204FirgunimInnerPagesElements_addBagdeFull48x38',name:'lead'};
                $scope.goal.points_points = 50;
                $scope.goal.points_rank = 7;
                $scope.goal.ranges = [{points:60,from:8,to:9,test:'',tag:'030204FirgunimInnerPagesElements_addBagdeFull48x38'}];
                $scope.goal.epoint = {tag:'030204FirgunimInnerPagesElements_addBagdeFull48x38'};
            }

            $scope.editGoal = function(goal){
                console.log(goal);
                initGoal();
                $scope.goal = goal;
                document.getElementById("mytab2").click()
            }

            $scope.addRange = function(){
                if ($scope.goal.ranges.length < 2)
                    $scope.goal.ranges.push({points:50,from:7,to:8,tag:'030204FirgunimInnerPagesElements_addBagdeFull48x38',test:''});
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

            $scope.finished = function(){
                console.log("OnFinish Done");
                var newGoal = {};

                if ($scope.goal.refreshCycle == 'day') {
                    $scope.goal.refreshCycles = $scope.goal.timeLength;
                }else if ($scope.goal.refreshCycle == 'week'){
                    $scope.goal.refreshCycles = getWorkingWeeks();
                }else if ($scope.goal.refreshCycle == 'month'){
                    $scope.goal.refreshCycles = getWorkingMonths();
                }else
                    $scope.goal.refreshCycles = 0;


                newGoal.name = $scope.goal.name;
                newGoal.goalId = $scope.goal.goalId;
                newGoal.startDate = $scope.goal.startDate;
                newGoal.endDate = $scope.goal.endDate;
                newGoal.refreshCycle = $scope.goal.refreshCycle;
                newGoal.refreshCycles = $scope.goal.refreshCycles;
                newGoal.points_rank = $scope.goal.points_rank;
                newGoal.points_points = $scope.goal.points_points;
                newGoal.pointsPerDay = $scope.goal.pointsPerDay;
                newGoal.timeLength = $scope.goal.timeLength;
                newGoal.tragetAwaredPoints = $scope.goal.tragetAwaredPoints;
                newGoal.ranges = [];
                for (var i = 0 ; i < $scope.goal.ranges.length;i++){
                    var range = {from:$scope.goal.ranges[i].from};
                    range.to = $scope.goal.ranges[i].to;
                    range.points = $scope.goal.ranges[i].points;
                    range.tag = $scope.goal.ranges[i].tag;
                    range.text = $scope.goal.ranges[i].text;
                    newGoal.ranges.push(range);
                };
                newGoal.tragetAwaredAbovePoints = $scope.goal.tragetAwaredAbovePoints;
                newGoal.epoint = {};
                newGoal.epoint.points = $scope.goal.epoint.points;
                newGoal.epoint.tag = $scope.goal.epoint.tag;
                newGoal.epoint.text = $scope.goal.epoint.text;
                newGoal.ahead = $scope.goal.ahead;
                newGoal.aImprovement = $scope.goal.aImprovement;
                newGoal.lead = {tag:$scope.goal.lead.tag,points:$scope.goal.lead.points};
                newGoal.improv = {tag:$scope.goal.improv.tag,points:$scope.goal.improv.points};
                newGoal.improvmenetPrecent = $scope.goal.improvmenetPrecent;
                newGoal.createdAt = new Date();
                Goals.insert(newGoal);
                initGoal();
                document.getElementById("mytab5").click();

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



            function getWorkingWeeks(){
                var result = 1;
                var firstCycle = true;

                var currentDate = angular.copy($scope.goal.startDate);
                while (currentDate <= $scope.goal.endDate)  {

                    var weekDay = currentDate.getDay();
                    if (!firstCycle && weekDay == 0)
                        result++;
                    firstCycle = false;
                    currentDate.setDate(currentDate.getDate()+1);
                }

                return result;
            }

            function getWorkingMonths(){
                    var result = 1;
                    var firstCycle = true;

                    var currentDate = angular.copy($scope.goal.startDate);
                    while (currentDate <= $scope.goal.endDate)  {

                        var monthDay = currentDate.getDate();
                        if (!firstCycle && monthDay == 1)
                            result++;
                        firstCycle = false;
                        currentDate.setDate(currentDate.getDate()+1);
                    }

                    return result;
                }

             $scope.toggleShowSelectTagState = function(selectedTag){
                 console.log(selectedTag);
                 $scope.selectedTagVisual = selectedTag;
                 $rootScope.showSelectTagState = true;
             }


        }
    }
})
