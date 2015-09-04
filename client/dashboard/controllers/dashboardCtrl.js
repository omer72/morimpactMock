angular.module("morimpact").controller("DashboardCtrl", [ '$rootScope','$meteor','$state',
  function( $rootScope,$meteor,$state){
console.log("dashboardCtrl");

    var dc = this;
    var generalPointsIndex = -1;
    dc.menuItems = [
      {
        name: 'מיקום כללי',
        icon: '0408SideMenuElements_DashBtn_ScoreIconFull170x74.png',
        sref: '.dashboard',
        id:'points',
        scopeName:'generalPlace'
      },
      {
        name: 'מיקום זמני שיחה',
        icon: '0410SideMenuElements_DashBtn_CallLenghtIconFull170x70.png',
        sref: '.profile',
        id:'talks',
        scopeName:'talks'
      },
      {
        name: 'מיקום אדיבות',
        icon: '0412SideMenuElements_DashBtn_NiceIconFull170x70.png',
        sref: '.table',
        id:'polite',
        scopeName:'polite'
      },
      {
        name: 'מיקום מכירות',
        icon: '0414SideMenuElements_DashBtn_SalesIconFull170x70.png',
        sref: '.table',
        id:'sales',
        scopeName:'sales'
      },
      {
        name: 'תרומה לצוות',
        icon: '0416SideMenuElements_DashBtn_TeamIconFull170x70.png',
        sref: '.table',
        id:'donation',
        point:'0/0'
      }
      ,
      {
        name: 'Leader board',
        icon: '0419SideMenuElements_BottomLeaderboardFull166x57.png',
        sref: '.leaderboard'
      },
      {
        name: 'פירגון לחברים',
        icon: '0421SideMenuElements_BottomFirgunFull166x57.png',
        sref: '.table',
        point:''

      },
      {
        name: 'Ace Statistics\n',
        icon: '0423SideMenuElements_BottomStatsFull166x57.png',
        sref: '.table',
        point:'0/0'
      }
    ];


    function init(){
      var generalPlaceId = GeneralPlace.findOne({userId : $rootScope.currentUser._id });
      var userPrefObject = UserPref.findOne({userId : $rootScope.currentUser._id });
      dc.userPref = $meteor.object(UserPref,userPrefObject._id );
      dc.userGroup = $meteor.object(Groups,$rootScope.currentUser.profile.groupId);
      dc.user  = $rootScope.currentUser;
      dc.groups = $meteor.collection(Groups);
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

      var usersByGroup = Meteor.users.find({"profile.groupId":$rootScope.currentUser.profile.groupId}).fetch();
      dc.userId = [];
      dc.usersMap = {};
      angular.forEach(usersByGroup, function(value, key) {
          dc.userId.push(value._id);
          dc.usersMap[value._id] = value.profile.name;
      });
    }

    init();

    dc.showCompleteList = function(value){
      console.log(value.scopeName);
    }

    function find(id,values){
      angular.fo
    }

    dc.logout = function(){
      Meteor.logout(function (value){
          if (!value){
              $state.transitionTo('login');
          }else{
              console.error(value);
          }
      });
    };

    dc.clickMenu = function(ev,value){
        console.log(value);
        dc.gp = GeneralPlace.find({userId:{"$in":dc.userId}}).fetch();
        console.log(dc.gp);
        dc.show_modal = true;
    }
     dc.close_modal = function(){
        $scope.show_modal = false;
    }

    //dc.removeAll = function(){
    //  dc.parties.remove();
    //};


}]);