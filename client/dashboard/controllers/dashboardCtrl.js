angular.module("morimpact").controller("DashboardCtrl", [ '$rootScope','$meteor','$state',
    function( $rootScope,$meteor,$state) {
        console.log("dashboardCtrl");

        var dc = this;
        var generalPointsIndex = -1;
        var leaderBoardIndex = 0;
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
                scopeName: 'firgon'

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
        }

        init();

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
                    dc.gp = GeneralPlace.find({userId: {"$in": dc.userId}}).fetch();
                    dc.show_modal = true;
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
                    dc.leaderBoardData = Talks.find({groupId: $rootScope.currentUser.profile.groupId}, {sort: {points: 1}}).fetch();
                    leaderBoardIndex = 0;
                    dc.leaderBoardArray = getLeaderBoardArray(leaderBoardIndex);
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
            if (dc.leaderBoardData.length - (index+1) * 8 < -8){
                dc.leaderBoardArray;
            }else{
                var leaderBoardArray = []
                var len = (dc.leaderBoardData.length - (index+1)*8) >0 ? 8 : (8-((index+1)*8-dc.leaderBoardData.length));
                var z = 0;
                for (var i = index*8;i<(index * 8 + len); i++){
                    leaderBoardArray[z] = dc.leaderBoardData[i];
                    z++;
                }
                dc.showingLeaderBoardValues = (index*8+1) + "-"+(index*8+z);
                return leaderBoardArray;
            }

        }
    }]);