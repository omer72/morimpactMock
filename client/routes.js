angular.module("morimpact").run(["$rootScope", "$location", function($rootScope, $location) {
  $rootScope.$on("$stateChangeError", function(event, next, previous, error) {
    // We can catch the error thrown when the $requireUser promise is rejected
    // and redirect the user back to the main page
    if (error === "AUTH_REQUIRED") {
      $location.path("/login");
    }
  });
}]);

angular.module("morimpact").config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
  function($urlRouterProvider, $stateProvider, $locationProvider){

    $locationProvider.html5Mode(true);

    $stateProvider

      .state('parties', {
        url: '/parties',
        templateUrl: 'client/parties/views/parties-list.ng.html',
        controller: 'PartiesListCtrl'
      })
        .state('dashboard', {
            url: '/dashboard',
            templateUrl: 'client/dashboard/views/dashboard.ng.html',
            controller: 'DashboardCtrl',
            controllerAs: 'dc',
            resolve: {
              "currentUser": ["$meteor", function($meteor){
                return $meteor.requireUser();
              }]
            }
        })
      .state('login', {
        url: '/login',
        templateUrl: 'client/login/views/login.ng.html',
          controller: 'LoginCtrl',
          controllerAs: 'loginCtrl'
      })
        .state('createFile', {
          url: '/createFile',
          templateUrl: 'client/createFile/views/createFile.ng.html',
          controller: 'createFileCtrl'
        })
        .state('updateData', {
          url: '/updateData',
          templateUrl: 'client/clientData/views/update-data.ng.html',
          controller: 'GettingStartedCtrl',
          controllerAs : 'start'
        });

    $urlRouterProvider.otherwise("/login");
  }]);