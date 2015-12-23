(function () {
    'use strict';

    function backandService($http, Backand) {

        var factory = {};

        factory.listOfObjects = function() {
            return $http({
                method: 'GET',
                url: Backand.getApiUrl() + '/1/table/config',
                params: {
                    pageSize: 200,
                    pageNumber: 1,
                    filter: '[{fieldName:"SystemView", operator:"equals", value: false}]',
                    sort: '[{fieldName:"captionText", order:"asc"}]'
                }
            });
        };



        factory.objectData = function(name, pageSize, pageNumber, sort, filter) {
            return $http({
                method: 'GET',
                url: Backand.getApiUrl() + '/1/objects/' + name,
                params: {
                    pageSize: pageSize || 5,
                    pageNumber: pageNumber || 1,
                    filter: filter || '',
                    sort: sort || ''
                }
            });
        };

        factory.postObjectData = function(name, object) {
            return $http({
                method: 'POST',
                url: Backand.getApiUrl() + '/1/objects/' + name,
                data: object
            });
        };

        return factory;

    }

    angular.module('morimpact')
        .factory('BackandService', ['$http','Backand', backandService]);
})();
