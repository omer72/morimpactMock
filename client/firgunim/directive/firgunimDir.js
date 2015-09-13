angular.module("morimpact").directive('firgunim', function () {
    return {
        restrict: "EA",
        replace: false,
        scope: {
            showfirgunim : "=",
            usersRecords : "=",
            firgunimText : "=",
            selectedTagVisual : '='
        },
        templateUrl: 'client/firgunim/directive/firgunim.ng.html',
        link: function (scope, element, attrs, ngModel) {
            scope.selectedTagVisual = '030205FirgunimInnerPagesElements_addBagdeLARGE_full_124x124';
            scope.selectTag = false;
            scope.range = _.range(1, 13);

            scope.selectedTag = function(value){
                value +=1;
                if (value<10){
                    value = "0"+value;
                }
                scope.$$childHead.selectedTagVisual = "0304"+value+"FirgunimInnerPagesElements_LargeBages126x126";
                scope.selectedTagVisual = "0303"+value+"FirgunimInnerPagesElements_Bages71x71"
            };




            //element.modal({
            //    onHide: function () {
            //        ngModel.$setViewValue(false);
            //    }
            //});
            //scope.$watch(function () {
            //    return ngModel.$modelValue;
            //}, function (modelValue){
            //    element.modal(modelValue ? 'show' : 'hide');
            //});
        },
        controller:function($scope){
            $scope.addSelectedTag = function(){
                console.log("showSelectTagState");
                $scope.$$childHead.showSelectTagState = false;
            }

            $scope.sendFirgun = function () {
                var firgun =
                    {
                        'userId': dc.selectUser._id,//$rootScope.currentUser._id,
                        'clientSystemId': dc.selectUser.profile.clientSystemId,
                        'firgunBy':$rootScope.currentUser._id,
                        'firgunText':"blsbla",
                        'firgunIcon':$scope.$$childHead.selectedTagVisual
                    }
                    ;
                Firgunim.insert(firgun);
            }
        }
    }
})
