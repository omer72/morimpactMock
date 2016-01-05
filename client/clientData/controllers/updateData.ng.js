(function () {
    'use strict';

    /**
     * @name  config
     * @description config block
     */


    /**
     * @name  gettingStartedCtrl
     * @description Controller
     */
    function GettingStartedCtrl($scope,$meteor, $log, $state, Backand, BackandService, $interval,$reactive) {

        console.log('GettingStartedCtrl');
        $reactive(this).attach($scope);
        var dc = this;
        this.subscribe('filterData');

        var start = this;

        this.helpers({
                latestFilterData: () => {
                    return FilterData.find({});
                }
        });
        var listenInterval;
        var updateInterval;
        var testDataTable = 'sekersResults';
        var testDataTableFiltered = 'sekerResultsFiltered';
        (function init() {
            console.log('GettingStartedCtrl -> init');
            start.username = '';
            start.password = '';
            start.appName = '';
            start.objects = null;
            start.isLoggedIn = false;
            start.objectData = '{}';
            start.results = 'Not connected to Backand yet';
            start.content = [];
            start.configFile = [];
            start.pageNum = 1;
            start.selectedDateTime = {
                value: new Date(2015, 11, 25)
            };
            start.defaultObject = ['clientSystemId', 'goalId','createdAt', 'groupId', 'id'];
            start.clientSystemId = 4501;
            loadObjects();
        }());


        start.signin = function () {

            Backand.setAppName(start.appName);

            Backand.signin(start.username, start.password)
                .then(
                function () {
                    start.results = "you are in";
                    loadObjects();
                },
                function (data, status, headers, config) {
                    $log.debug("authentication error", data, status, headers, config);
                    start.results = data;
                }
            );
        };

        start.signout = function () {
            Backand.signout();
            $state.go('root.getting-started', {}, {reload: true});
        }


        function loadObjects() {
            BackandService.listOfObjects().then(loadObjectsSuccess, errorHandler);
        }

        function loadObjectsSuccess(list) {
            start.objects = list.data.data;
            start.results = "Objects loaded";
            start.isLoggedIn = true;
        }

        start.loadObjectData = function () {
            //BackandService.objectData(start.objectSelected).then(loadObjectDataSuccess, errorHandler);
        }

        start.loadObjectDataFiltered = function () {
            BackandService.objectData(testDataTable, 1000, start.pageNum, "", JSON.stringify([{
                "fieldName": "createdAt",
                "operator": "greaterThan",
                "value": start.latestObjectDate
            }])).then(
                loadObjectDataSuccess, errorHandler
            )
        }

        //start.loadLatestObjectDataFiltered = function () {
        //    BackandService.objectData(testDataTableFiltered, 1, 1, JSON.stringify([{
        //        "fieldName": "createdAt",
        //        "order": "desc"
        //    }])).then(
        //        loadLatestObjectDataFilteredSuccess, errorHandler
        //    )
        //}

        function loadLatestObjectDataFilteredSuccess() {
            if (start.latestFilterData.length > 0) {
                start.latestObjectDate = start.latestFilterData[0].createdAt;
            } else {
                var tempDate = new Date();
                tempDate.setMonth(tempDate.getMonth() - 3);
                start.latestObjectDate = tempDate;
            }
            start.loadObjectDataFiltered();
        }


        function filterResultData() {

            var filterdValues = [];
            angular.forEach(start.objectData, function (value, key) {
                var newValue = _.pick(value, start.defaultObject);
                angular.forEach(Object.keys(start.configFile.config[0]), function (key, index) {
                    if (newValue[key] < start.configFile.config[0][key]) {
                        newValue[key] = undefined;
                    }
                })
                newValue.handled = false;
                this.push(newValue);
                FilterData.insert(newValue);
            }, filterdValues);
            console.log(filterdValues);

            if (start.objectData.length >= 1000) {
                start.pageNum += 1;
                start.loadObjectDataFiltered();
            }


        }

        start.startProcess = function () {
            listenInterval = $interval(loadLatestObjectDataFilteredSuccess, 10000);
        }

        start.stopProcess = function () {
            if (angular.isDefined(listenInterval)) {
                $interval.cancel(listenInterval);
                listenInterval = undefined;
            }
        };

        //start.$on('$destroy', function() {
        //  // Make sure that the interval is destroyed too
        //  $scope.stopProcess();
        //});

        function loadObjectDataSuccess(ObjectData) {
            start.objectData = ObjectData.data.data;
            filterResultData();
        }

        function errorHandler(error, message) {
            $log.debug(message, error)
        }

        start.showContent = function ($fileContent) {
            start.content = $fileContent;
            start.content = JSON.parse(start.content);
        };

        start.readConfigFile = function ($fileContent) {
            start.configFile = $fileContent;
            start.configFile = JSON.parse(start.configFile);
            start.defaultObject.push.apply(start.defaultObject, _.keys(start.configFile.config[0]));

        };

        start.uploadData = function (tableName, values) {
            BackandService.postObjectData(tableName, values).then(
                function success(data) {
                    console.log(data);
                },
                function error(err) {
                    console.error(err);
                }
            )
        }

        start.restartNewData  = function(){
            $interval.cancel(updateInterval);
            start.clientSystemId = 4501;
            start.generateNewData();
        }

        start.generateNewData = function () {
            updateInterval = $interval(function () {
                start.clientSystemId ++;
                if (start.clientSystemId > 4610){
                    start.clientSystemId = 4500;
                }
                var newData = {"clientSystemId": start.clientSystemId};
                newData.Q1 = getRandomInt(5, 10);
                newData.Q2 = getRandomInt(5, 10);
                newData.Q3 = getRandomInt(5, 10);
                newData.Q4 = getRandomInt(5, 10);
                newData.Q5 = getRandomInt(5, 10);
                newData.Q6 = getRandomInt(5, 10);
                newData.Q7 = getRandomInt(5, 10);
                newData.Q8 = getRandomInt(5, 10);
                newData.Q9 = getRandomInt(5, 10);
                newData.id = Math.floor(Math.random());
                newData.createdAt = new Date();
                newData.goalId = 3;
                BackandService.postObjectData(testDataTable, newData).then(
                    function success(data) {
                        console.log(data);
                    },
                    function error(err) {
                        console.error(err);
                    }
                )
            }, 5000);
        }

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }
    }

    angular.module('morimpact')
        .controller('GettingStartedCtrl', ['$scope','$meteor', '$log', '$state', 'Backand', 'BackandService', '$interval','$reactive', GettingStartedCtrl]);
})();
/**
 * Created by oetrog on 09/12/2015.
 */
