angular.module("morimpact").directive('firgunim', function () {
    return {
        restrict: "EA",
        replace: false,
        scope: {
            showfirgunim : "=",
            usersRecords : "="
        },
        templateUrl: 'client/firgunim/directive/firgunim.ng.html',
        link: function (scope, element, attrs, ngModel) {
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
        }
    }
})
