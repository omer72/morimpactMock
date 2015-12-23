(function() {
    'use strict';

    function readFileDir($parse) {
        return {
            restrict: 'A',
            /*jshint unused:false*/
            link: function(scope, elm, attrs) {
                console.log("onReadFile");
                var fn = $parse(attrs.onReadFile);
                elm.on('change', function (onChangeEvent) {
                    console.log("onReadFile change");
                    var reader = new FileReader();

                    reader.onload = function (onLoadEvent) {
                        scope.$apply(function () {
                            fn(scope, {$fileContent: onLoadEvent.target.result});
                        });
                    };

                    reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
                })
            }
        };
    }

    angular.module('morimpact')
        .directive('onReadFile', readFileDir);
})();
