angular.module("morimpact").directive('tabItem',  function ($rootScope) {
    return {
        restrict: "A",
        replace: true,
        link: function (scope, element, attrs) {
            var ACTIVE_CLASS = 'active';
            var id = attrs.id;

            element.on('click', changeTab);

            function removeClass (el) {
                el.classList.remove(ACTIVE_CLASS);
            }


            function changeTab () {

                $rootScope.$broadcast("changeTab" , id);
                // Remove the active class from all tab items and tab contents
                Array.prototype.slice.call(document.querySelectorAll('.tab.active')).map(removeClass);

                // Add the active class to current tab and it content
                element.addClass(ACTIVE_CLASS);
                document.querySelector('.tab.segment.' + id).classList.add(ACTIVE_CLASS);
            }
        }
    };
});