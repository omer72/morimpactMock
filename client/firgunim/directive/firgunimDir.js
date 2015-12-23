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
            console.log("firgunim init");

            scope.tag = '030204FirgunimInnerPagesElements_addBagdeFull48x38';
            scope.selectTag = false;

            scope.sendFirgun = function () {
                console.log("sendFurgun");
                var firgun =
                    {
                        'createdAt' : new Date().getTime(),
                        'clientSystemId': scope.$$childHead.selectUser.clientSystemId,
                        'firgunTo': scope.$$childHead.selectUser,
                        'firgunById':scope.$root.currentUser.profile.clientSystemId,
                        'firgunBy':scope.$root.currentUser.profile.lastName + ' '+scope.$root.currentUser.profile.firstName,
                        'firgunText':(scope.$$childHead.firgun.text == 'freeText')? scope.$$childHead.firgun.freeText :scope.$$childHead.firgun.text ,
                        'firgunIcon':(scope.$$childHead.tag == '030204FirgunimInnerPagesElements_addBagdeFull48x38')?'':scope.$$childHead.tag
                    }
                    ;
                Firgunim.insert(firgun);
                scope.$parent.dc.close_modal();
                scope.$parent.dc.getLatestFirgun();
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
        controller:function($scope,$rootScope){
            console.log("firgunim initC");
            $scope.toggleShowSelectTagState = function(){
                $scope.selectedTagVisual = this;
                $rootScope.showSelectTagState = true;
            }
        }
    }
})
