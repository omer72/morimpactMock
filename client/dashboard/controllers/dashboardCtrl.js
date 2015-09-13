angular.module("morimpact").controller("DashboardCtrl", [ '$rootScope','$meteor','$state','$scope',
    function( $rootScope,$meteor,$state,$scope) {
        console.log("dashboardCtrl");

        var dc = this;
        var generalPointsIndex = -1;
        var leaderBoardIndex = 0;
        dc.searchPosition = 1;
        dc.searchData ="";
        dc.leaderBoardAnimation = "fadeInRightBig"
        dc.showingLeaderBoardValues = "1-8"
        dc.menuItems = [
            {
                name: 'מיקום כללי',
                icon: '0408SideMenuElements_DashBtn_ScoreIconFull170x74.png',
                sref: '.dashboard',
                id: 'points',
                scopeName: 'generalPlace'
            },
            {
                name: 'מיקום זמני שיחה',
                icon: '0410SideMenuElements_DashBtn_CallLenghtIconFull170x70.png',
                sref: '.profile',
                id: 'talks',
                scopeName: 'talks'
            },
            {
                name: 'מיקום אדיבות',
                icon: '0412SideMenuElements_DashBtn_NiceIconFull170x70.png',
                sref: '.table',
                id: 'polite',
                scopeName: 'polite'
            },
            {
                name: 'מיקום מכירות',
                icon: '0414SideMenuElements_DashBtn_SalesIconFull170x70.png',
                sref: '.table',
                id: 'sales',
                scopeName: 'sales'
            },
            {
                name: 'תרומה לצוות',
                icon: '0416SideMenuElements_DashBtn_TeamIconFull170x70.png',
                sref: '.table',
                id: 'contributes',
                scopeName: 'contributes',
                point: '0/0'
            }
            ,
            {
                name: 'Leader board',
                icon: '0419SideMenuElements_BottomLeaderboardFull166x57.png',
                sref: '.leaderboard',
                scopeName: 'leaderBoard'
            },
            {
                name: 'פירגון לחברים',
                icon: '0421SideMenuElements_BottomFirgunFull166x57.png',
                sref: '.table',
                scopeName: 'firgunim'

            },
            {
                name: 'Ace Statistics\n',
                icon: '0423SideMenuElements_BottomStatsFull166x57.png',
                sref: '.table',
                point: '0/0'
            }
        ];


        function init() {
            var generalPlaceId = GeneralPlace.findOne({userId: $rootScope.currentUser._id});
            dc.clientSystemId = $rootScope.currentUser.profile.clientSystemId;
            dc.clientGroup = $rootScope.currentUser.profile.groupId;

            dc.userGroup = Groups.findOne({groupId: dc.clientGroup});

            dc.user = $rootScope.currentUser;
            dc.groups = $meteor.collection(Groups);
            if (!generalPlaceId) {
                var generalPlace =
                    {
                        'userId': $rootScope.currentUser._id,
                        'points': 0
                    }
                    ;
                generalPlaceId = {};
                generalPlaceId._id = GeneralPlace.insert(generalPlace);
            }

            var userPrefObject = UserPref.findOne({userId: $rootScope.currentUser._id});

            if (!userPrefObject) {
                var userPref =
                    {
                        'userId': $rootScope.currentUser._id,
                        "robotPicName": "1101",
                        "backgroundPicture": "0003mainBGVars_daylightSnowing"
                    }
                    ;
                userPrefObject = {};
                userPrefObject._id = UserPref.insert(userPref);
            }
            dc.userPref = $meteor.object(UserPref, userPrefObject._id);

            dc.generalPlace = $meteor.object(GeneralPlace, generalPlaceId._id);

            var talksId = Talks.findOne({userId: $rootScope.currentUser._id});
            if (!talksId) {
                var talks =
                    {
                        'userId': $rootScope.currentUser._id,
                        'points': 0
                    }
                    ;
                talksId = {};
                talksId._id = Talks.insert(talks);
            }
            dc.talks = $meteor.object(Talks, talksId._id);

            var politeId = Polite.findOne({userId: $rootScope.currentUser._id});
            if (!politeId) {
                var polite =
                    {
                        'userId': $rootScope.currentUser._id,
                        'points': 0
                    }
                    ;
                politeId = {};
                politeId._id = Polite.insert(polite);
            }
            dc.polite = $meteor.object(Polite, politeId._id);

            var salesId = Sales.findOne({userId: $rootScope.currentUser._id});
            if (!salesId) {
                var sales =
                    {
                        'userId': $rootScope.currentUser._id,
                        'points': 0
                    }
                    ;
                salesId = {};
                salesId._id = Sales.insert(sales);
            }
            dc.sales = $meteor.object(Sales, salesId._id);

            var usersByGroup = Meteor.users.find({"profile.groupId": $rootScope.currentUser.profile.groupId}).fetch();
            dc.userId = [];
            dc.usersMap = {};
            angular.forEach(usersByGroup, function (value, key) {
                dc.userId.push(value.profile.clientSystemId);
                dc.usersMap[value.profile.clientSystemId] = [value.profile.firstName,value.profile.lastName];
            });
            dc.usersRecords = [{a:1}];
            dc.usersRecords = $meteor.collection(UsersRecords);
            dc.usersRecordsMap = {}
            angular.forEach(dc.usersRecords, function(value, key) {
                dc.usersRecordsMap[value.clientSystemId] = value;
            });
            dc.currentUserRecords = $meteor.object(UsersRecords,dc.usersRecordsMap[$rootScope.currentUser.profile.clientSystemId]._id);
            dc.firgunimText = $meteor.collection(FirgunimText);

        }

        $scope.$watch('dc.currentUserRecords.points',function(){
            updateUserPref();
        })

        updateUserPref = function(){
            dc.currentUser = dc.usersRecordsMap[$rootScope.currentUser.profile.clientSystemId];
            var robotId = 1;
            if (dc.currentUser.points <=200)
                robotId = 1;
            else if (dc.currentUser.points >200 && dc.currentUser.points <=400)
                robotId = 2;
            else if (dc.currentUser.points >400 && dc.currentUser.points <=600)
                robotId = 3;
            else if (dc.currentUser.points >600 && dc.currentUser.points <=800)
                robotId = 4;
            else if (dc.currentUser.points >800 && dc.currentUser.points <=1000)
                robotId = 5;
            else if (dc.currentUser.points >1000 && dc.currentUser.points <=1200)
                robotId = 6;
            else if (dc.currentUser.points >1200 && dc.currentUser.points <=1400)
                robotId = 7;
            else if (dc.currentUser.points >1400 && dc.currentUser.points <=1600)
                robotId = 8;
            else
                robotId = 9;

            dc.userPref.robotPicName =  '110'+robotId;
            dc.userPref.save();

        }

        init();
        updateUserPref();



        dc.showCompleteList = function (value) {
            console.log(value.scopeName);
        }


        dc.logout = function () {
            Meteor.logout(function (value) {
                if (!value) {
                    $state.transitionTo('login');
                } else {
                    console.error(value);
                }
            });
        };

        dc.clickMenu = function (ev, value) {
            console.log(value);
            switch (value.scopeName) {
                case "generalPlace":
                    dc.gp = Meteor.users.find({ "profile.groupId" : $rootScope.currentUser.profile.groupId}, {sort: {sumPoints: 1}}).fetch();
                    dc.show_generalPlace = true;
                    break;
                case "talks":
                    dc.gp = Talks.find({groupId: $rootScope.currentUser.profile.groupId}, {sort: {points: 1}}).fetch();
                    dc.show_modal = true;
                    break;
                case "polite":
                    dc.gp = Polite.find({groupId: $rootScope.currentUser.profile.groupId}, {sort: {points: 1}}).fetch();
                    dc.show_modal = true;
                    break;
                case "sales":
                    dc.gp = Sales.find({groupId: $rootScope.currentUser.profile.groupId}, {sort: {points: 1}}).fetch();
                    dc.show_modal = true;
                    break;
                case "contributes":
                    dc.gp = Contributes.find({groupId: $rootScope.currentUser.profile.groupId}, {sort: {points: 1}}).fetch();
                    dc.show_modal = true;
                    break;
                case "leaderBoard":
                    dc.show_leaderboard = true;
                    dc.leaderBoardData = Talks.find({groupId: $rootScope.currentUser.profile.groupId}, {sort: {points: -1}}).fetch();
                    leaderBoardIndex = 0;
                    dc.leaderBoardArray = getLeaderBoardArray(leaderBoardIndex);
                    break;
                case "firgunim":
                    dc.show_firgunim = true;
                    dc.leaderBoardData = Talks.find({groupId: $rootScope.currentUser.profile.groupId}, {sort: {points: 1}}).fetch();
                    break;
            }

            console.log(dc.gp);
            dc.title = value.name;

        }

        dc.showNext = function(){
            leaderBoardIndex++;
            dc.leaderBoardArray = getLeaderBoardArray(leaderBoardIndex);
        }

        dc.showPref = function(){

            leaderBoardIndex--;
            dc.leaderBoardArray = getLeaderBoardArray(leaderBoardIndex);
        }


        dc.close_modal = function () {
            dc.show_modal = false;
        }

        getLeaderBoardArray = function (index) {
            if (dc.leaderBoardData.length - (index+1)  < -8){
                dc.leaderBoardArray;
            }else{
                var leaderBoardArray = []
                var len = (dc.leaderBoardData.length - (index+1)) >0 ? 8 : (8-((index+1)-dc.leaderBoardData.length));
                var z = 0;
                for (var i = index;i<(index  + len); i++){
                    leaderBoardArray[z] = dc.leaderBoardData[i];
                    z++;
                }
                dc.showingLeaderBoardValues = (index+1) + "-"+(index+z);
                return leaderBoardArray;
            }

        }


        $scope.$watch('dc.searchData',  function(val){
            console.log(dc.searchData);
            dc.usersResult = Meteor.users.find({ "profile.firstName" : {$regex:dc.searchData,$options:'i'}}).fetch();
        });

        dc.fargenUser = function(user){
            dc.selectUser = user;
            dc.searchPosition = 2;
        }
        


    }]);