angular.module("morimpact").controller("DashboardCtrl", [ '$rootScope','$meteor',
  function( $rootScope,$meteor){
console.log("dashboardCtrl");

    var dc = this;
    var generalPointsIndex = -1;
    dc.menuItems = [
      {
        name: 'מיקום כללי',
        icon: 'dashboard',
        sref: '.dashboard',
        id:'points',
        scopeName:'generalPlace'
      },
      {
        name: 'מיקום זמני שיחה',
        icon: 'person',
        sref: '.profile',
        id:'talks',
        scopeName:'talks'
      },
      {
        name: 'מיקום אדיבות',
        icon: 'view_module',
        sref: '.table',
        id:'polite',
        scopeName:'polite'
      },
      {
        name: 'מיקום מכירות',
        icon: 'view_module',
        sref: '.table',
        id:'sales',
        scopeName:'sales'
      },
      {
        name: 'תרומה לצוות',
        icon: 'view_module',
        sref: '.table',
        id:'donation',
        point:'0/0'
      },
      {
        name: 'Open Leaderboard',
        icon: 'leaderboard',
        sref: '.leaderboard'
      },
      {
        name: 'פירגון לעמית',
        icon: 'view_module',
        sref: '.table',
        point:''

      },
      {
        name: 'Reports',
        icon: 'reports',
        sref: '.table',
        point:'0/0'
      }
    ];


    function init(){
      var generalPlaceId = GeneralPlace.findOne({userId : $rootScope.currentUser._id });

      if (!generalPlaceId){
        var generalPlace =
          {'userId': $rootScope.currentUser._id,
            'points': 0}
        ;
        generalPlaceId = {};
        generalPlaceId._id = GeneralPlace.insert(generalPlace);
      }
      dc.generalPlace = $meteor.object(GeneralPlace, generalPlaceId._id);

      var talksId = Talks.findOne({userId : $rootScope.currentUser._id });
      if (!talksId){
        var talks =
            {'userId': $rootScope.currentUser._id,
              'points': 0}
            ;
        talksId = {};
        talksId._id = Talks.insert(talks);
      }
      dc.talks = $meteor.object(Talks, talksId._id);

      var politeId = Polite.findOne({userId : $rootScope.currentUser._id });
      if (!politeId){
        var polite =
            {'userId': $rootScope.currentUser._id,
              'points': 0}
            ;
        politeId = {};
        politeId._id = Polite.insert(polite);
      }
      dc.polite = $meteor.object(Polite, politeId._id);

      var salesId = Sales.findOne({userId : $rootScope.currentUser._id });
      if (!salesId){
        var sales =
            {'userId': $rootScope.currentUser._id,
              'points': 0}
            ;
        salesId = {};
        salesId._id = Sales.insert(sales);
      }
      dc.sales = $meteor.object(Sales, salesId._id);
    }

    init();

    function find(id,values){
      angular.fo
    }

    dc.remove = function(party){
      dc.parties.splice( dc.parties.indexOf(party), 1 );
    };

    dc.removeAll = function(){
      dc.parties.remove();
    };
}]);