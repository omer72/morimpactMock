angular.module("morimpact").directive('choosetag', chooseTag);

function chooseTag() {
    return {
        restrict: "EA",
        replace: false,
        scope: {
            selectedTagVisualMenu : "=",
            selectedTagVisual : '=',
            showSelectTagState : "="
        },
        templateUrl: 'client/directives/chooseTag.ng.html',

        link: function(scope, element, attrs, ngModel, transclude) {
            console.log("chooseTag link");
            scope.range = _.range(1, 13);
        },
        controller:function($scope){
            console.log("chooseTag contoller");

            $scope.selectedTagVisualMenu = "030205FirgunimInnerPagesElements_addBagdeLARGE_full_124x124";

            $scope.selectedTag = function(value){
                value +=1;
                if (value<10){
                    value = "0"+value;
                }
                $scope.selectedTagVisual = "0303"+value+"FirgunimInnerPagesElements_Bages71x71";
                $scope.selectedTagVisualMenu = "0304"+value+"FirgunimInnerPagesElements_LargeBages126x126";
            };

            $scope.cancelSelectedTag = function(){
                $scope.selectedTagVisual = '030204FirgunimInnerPagesElements_addBagdeFull48x38';
                $scope.selectedTagVisualMenu = "030205FirgunimInnerPagesElements_addBagdeLARGE_full_124x124";
            }

            $scope.addSelectedTag = function(){
                console.log("showSelectTagState");
                $scope.showSelectTagState = false;
            }
            //var checked = false;
            //var disabled = false;
            //var input = element.find('input');
            //
            //transclude(scope, function(nodes) {
            //    element.find('label').append(nodes);
            //});
            //
            //element.on('click', toggleFn);
            //
            //if (!ngModel) {
            //    throw new Error('Semantic-UI-Angular: The \'smCheckbox\' directive requires a \'ng-model\' value');
            //}
            //
            //ngModel.$render = function() {
            //    checked = ngModel.$viewValue;
            //    input.prop('checked', checked);
            //};
            //
            //scope.$watch(attrs.ngDisabled, function(val) {
            //    disabled = val || false;
            //    input.attr('disabled', disabled);
            //});
            //
            //
            //if (attrs.toggle !== void 0) {
            //    element.addClass('toggle');
            //}
            //else if (attrs.slider !== void 0) {
            //    element.addClass('slider');
            //}
            //
            //if (attrs.ariaLabel === void 0) {
            //    element.attr('aria-label', element[0].textContent.trim());
            //}
            //
            //function toggleFn() {
            //    console.log("toggleFn");
            //    if (disabled) { return; }
            //
            //    checked = !checked;
            //    input.prop('checked', checked);
            //    ngModel.$setViewValue(checked);
            //    scope.$apply();
            //}
        }
    };

}