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
            scope.selectedTagVisual = '030204FirgunimInnerPagesElements_addBagdeFull48x38';
            scope.selectedTagVisualMenu = "030205FirgunimInnerPagesElements_addBagdeLARGE_full_124x124";
            scope.selectTag = false;
            scope.range = _.range(1, 13);

            scope.selectedTag = function(value){
                value +=1;
                if (value<10){
                    value = "0"+value;
                }
                scope.$$childHead.selectedTagVisual = "0303"+value+"FirgunimInnerPagesElements_Bages71x71";
                scope.$$childHead.selectedTagVisualMenu = "0304"+value+"FirgunimInnerPagesElements_LargeBages126x126";
            };

            scope.cancelSelectedTag = function(){
                scope.$$childHead.selectedTagVisual = '030204FirgunimInnerPagesElements_addBagdeFull48x38';
                scope.$$childHead.selectedTagVisualMenu = "030205FirgunimInnerPagesElements_addBagdeLARGE_full_124x124";
            }

            scope.sendFirgun = function () {
                console.log("sendFurgun");
                var firgun =
                    {
                        'clientSystemId': scope.$$childHead.selectUser.clientSystemId,
                        'firgunTo': scope.$$childHead.selectUser.name,
                        'firgunById':scope.$root.currentUser.profile.clientSystemId,
                        'firgunBy':scope.$root.currentUser.profile.lastName + ' '+scope.$root.currentUser.profile.firstName,
                        'firgunText':scope.$$childHead.firgun.text,
                        'firgunIcon':scope.$$childHead.selectedTagVisual
                    }
                    ;
                Firgunim.insert(firgun);
            }


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




        }
    }
})
