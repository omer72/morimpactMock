angular.module("morimpact").controller("DashboardCtrl", [ '$reactive','$meteor','$state','$scope','$interval',
    function( $reactive,$meteor,$state,$scope,$interval) {
        console.log("dashboardCtrl");
        $reactive(this).attach($scope);
        var dc = this;
        this.subscribe('usersRecords');
        this.subscribe('groups');
        this.subscribe('userPref');
        this.subscribe('contributes');
        this.subscribe('talks');
        this.subscribe('polite');
        this.subscribe('sales');
        this.subscribe('firgunim');
        this.subscribe('users');

        dc.currentUserProfile = Meteor.user().profile;

        this.helpers({
                usersRecords: () => {
                    return UsersRecords.find({});
                },
                userGroup: () => {
                    return Groups.findOne({groupId: dc.currentUserProfile.groupId});
                },
                groups: () =>{
                    return Groups.find({});
                },
                userPref : () =>{
                    return UserPref.findOne({clientSystemId: parseInt(dc.currentUserProfile.clientSystemId)});
                },
                usersPref : () =>{
                    return UserPref.find({});
                },
                currentUserRecords: () =>{
                    return UsersRecords.findOne({clientSystemId:parseInt(dc.currentUserProfile.clientSystemId)});
                },
                contributesRanks: () =>{
                    return Contributes.find({groupId: dc.currentUserProfile.groupId}, {sort: {sumPoints: -1}});
                },
                talksRanks: () =>{
                    return Talks.find({groupId:dc.currentUserProfile.groupId},{sort: {points: -1}});
                },
                polite: () =>{
                    return Polite.findOne({clientSystemId:parseInt(dc.currentUserProfile.clientSystemId)});
                },
                sales: () =>{
                    return Sales.findOne({clientSystemId:parseInt(dc.currentUserProfile.clientSystemId)});
                },
                firgunim: () =>{
                    return Firgunim.find({},  {sort: {createdAt: 1}});
                },
                generalPlaceRanks:() =>{
                    return UsersRecords.find({groupId: dc.currentUserProfile.groupId}, {sort: {points: -1}});
                    return UsersRecords.find({groupId: dc.currentUserProfile.groupId}, {sort: {points: -1}});
                },
                politeRanks:() =>
                {
                    return Polite.find({groupId: dc.currentUserProfile.groupId}, {sort: {points: -1}});
                },
                usersByGroup:() =>{
                    return Meteor.users.find({'profile.groupId': dc.currentUserProfile.groupId});
                },
                salesRanks:() =>{
                    return Sales.find({groupId: dc.currentUserProfile.groupId}, {sort: {points: -1}});
                }

        });

        var generalPointsIndex = -1;
        dc.leaderBoardIndex = 0;
        dc.searchPosition = 1;
        dc.searchData ="";
        dc.leaderBoardAnimation = "fadeInRight";
        dc.showingLeaderBoardValues = "1-8";
        var firgunimLength = 0;
        var latestFirgunIndex = 0;
        dc.menuItems = [
            {
                header : 'Total Ace',
                name: 'מיקום כללי',
                icon: '0408SideMenuElements_DashBtn_ScoreIconFull170x74.png',
                sref: '.dashboard',
                id: 'points',
                scopeName: 'generalPlaceRanks'
            },
            {
                header : 'Ace Rank',
                name: 'מיקום זמני שיחה',
                icon: '0410SideMenuElements_DashBtn_CallLenghtIconFull170x70.png',
                sref: '.profile',
                id: 'talks',
                scopeName: 'talksRanks'
            },
            {
                header : 'Ace Rank',
                name: 'מיקום אדיבות',
                icon: '0412SideMenuElements_DashBtn_NiceIconFull170x70.png',
                sref: '.table',
                id: 'polite',
                scopeName: 'politeRanks'
            },
            {
                header : 'Ace Rank',
                name: 'מיקום מכירות',
                icon: '0414SideMenuElements_DashBtn_SalesIconFull170x70.png',
                sref: '.table',
                id: 'sales',
                scopeName: 'salesRanks'
            },
            {
                header : 'Team Ace',
                name: 'תרומה לצוות',
                icon: '0416SideMenuElements_DashBtn_TeamIconFull170x70.png',
                sref: '.table',
                id: 'contributes',
                scopeName: 'contributesRanks',
            }
            ,
            {
                header: 'Leader board',
                icon: '0419SideMenuElements_BottomLeaderboardFull166x57.png',
                sref: '.leaderboard',
                scopeName: 'leaderBoard'
            },
            {
                header: 'פירגון לחברים',
                icon: '0421SideMenuElements_BottomFirgunFull166x57.png',
                sref: '.table',
                scopeName: 'firgun'

            },
            {
                header: 'Ace Statistics',
                name : 'הסטיסטיקה שלי',
                icon: '0423SideMenuElements_BottomStatsFull166x57.png',
                sref: '.table',
                point: '0/0'
            }
        ];

        dc.getUserPrefByClientSystemId = function(value){
            var userPref =  dc.usersPref.filter(function(item){
                return (item.clientSystemId == value);
            });
            return userPref[0];
        }
        function init() {

            dc.usersPrefMap = {};
            angular.forEach(dc.usersPref, function (value, key) {
                dc.usersPrefMap[value.clientSystemId] = value.robotPicName;
            });

            dc.usersRecordsMap = {}
            angular.forEach(dc.usersRecords, function(value, key) {
                dc.usersRecordsMap[value.clientSystemId] = value;
            });

            //dc.firgunimText = $meteor.collection(FirgunimText);

            dc.getLatestFirgun();
        }

        dc.getLatestFirgun = function(){
            if (dc.firgunim.length > 0 ){
                dc.showFirgunObject = {
                    firgunBy : dc.firgunim[0].firgunBy,
                    firgunTo : dc.firgunim[0].firgunTo,
                    firgunText : dc.firgunim[0].firgunText,
                    firgunIcon : dc.firgunim[0].firgunIcon
                }
                latestFirgunIndex++;
            }
        }
        dc.getUserByClientId = function(value){
            var user =  (dc.usersByGroup.filter(function(item){
                return (item.profile.clientSystemId == value.clientSystemId);
            }));
            if (user != undefined && user.length > 0)
                return user[0].profile.firstName + " " + user[0].profile.lastName;
            else
                return "";
        }

        dc.getFirstNameUserByClientId = function(value){
            var user =  (dc.usersByGroup.filter(function(item){
                return (item.profile.clientSystemId == value.clientSystemId);
            }));
            if (user != undefined && user.length > 0)
                return user[0].profile.firstName;
            else
                return "";
        }

        dc.getLastNameUserByClientId = function(value){
            var user =  (dc.usersByGroup.filter(function(item){
                return (item.profile.clientSystemId == value.clientSystemId);
            }));
            if (user != undefined && user.length > 0)
                return user[0].profile.lastName;
            else
                return "";
        }
        $scope.$watch('dc.usersByGroup',function(value){
            if (value != undefined) {
                dc.userId = [];
                dc.usersMap = {};
                angular.forEach(dc.usersByGroup, function (value, key) {
                    dc.userId.push(value.profile.clientSystemId);
                    dc.usersMap[value.profile.clientSystemId] = [value.profile.firstName, value.profile.lastName];
                });
            }
        })
        $scope.$watch('dc.currentUserRecords.points',function(value){
            updateUserPref();
        });


        $scope.$watch('currentUserRecords',function(value){
            updateUserPref();
        })
        $scope.$watch('dc.firgunim',function(value){
            console.log('dc.firgunim');
            dc.getLatestFirgun();
            latestFirgunIndex = 0;
        });



        updateUserPref = function() {
            dc.currentUser = dc.currentUserRecords;
            var robotId = 1;
            if (dc.currentUser != undefined) {

                if (dc.currentUser.points <= 200)
                    robotId = 1;
                else if (dc.currentUser.points > 200 && dc.currentUser.points <= 400)
                    robotId = 2;
                else if (dc.currentUser.points > 400 && dc.currentUser.points <= 600)
                    robotId = 3;
                else if (dc.currentUser.points > 600 && dc.currentUser.points <= 800)
                    robotId = 4;
                else if (dc.currentUser.points > 800 && dc.currentUser.points <= 1000)
                    robotId = 5;
                else if (dc.currentUser.points > 1000 && dc.currentUser.points <= 1200)
                    robotId = 6;
                else if (dc.currentUser.points > 1200 && dc.currentUser.points <= 1400)
                    robotId = 7;
                else if (dc.currentUser.points > 1400 && dc.currentUser.points <= 1600)
                    robotId = 8;
                else
                    robotId = 9;
                if (dc.userPref != undefined){
                    dc.userPref.robotPicName =  '110'+robotId;
                    dc.saveUserPref(dc.userPref.robotPicName);
                }

            }


        }

        dc.saveUserPref = (value) => {
            UserPref.update({_id: dc.userPref._id}, {
                $set: {
                    robotPicName: value
                }
                }, (error) => {
                    if (error) {
                    console.log('Oops, unable to update the UserPref...');
                }
                else {
                    console.log('Done!');
                }
            });
        };


        dc.getPoints  = function(value){
            if (dc[value]!= undefined)
                return findWithAttr(dc[value],'clientSystemId',dc.currentUserProfile.clientSystemId) + "/"+dc[value].length;
            else
                return "";
        }
        function findWithAttr(array, attr, value) {
            for(var i = 0; i < array.length; i += 1) {
                if(array[i][attr] == value) {
                    return i+1;
                }
            }
        }

        function findValueOfUser(array, attr, value) {
            for(var i = 0; i < array.length; i += 1) {
                if(array[i][attr] == value) {
                    return array[i];
                }
            }
        }

        function updateFirgun(){
            $interval(function() {
                if (dc.firgunim.length >0 ){
                    if (dc.firgunim.length != firgunimLength || (latestFirgunIndex+1)> firgunimLength){
                        firgunimLength = dc.firgunim.length;
                        latestFirgunIndex = 0;
                    }
                    dc.showFirgunObject = {
                        firgunBy : dc.firgunim[latestFirgunIndex].firgunBy,
                        firgunTo : dc.firgunim[latestFirgunIndex].firgunTo,
                        firgunText : dc.firgunim[latestFirgunIndex].firgunText,
                        firgunIcon : dc.firgunim[latestFirgunIndex].firgunIcon
                    }
                    latestFirgunIndex++;
                }else{
                    dc.showFirgunObject = undefined;
                }
            }, 5000);
        }

        init();
        updateUserPref();
        updateFirgun();


        dc.showCompleteList = function (value) {
            console.log(value.scopeName);
        }

        $scope.$watch('show_modal',function showModel(newValue,oldValue){
            console.log('show_modal');
        })


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
                case "generalPlaceRanks":
                    dc.gp = dc.generalPlaceRanks;
                    dc.show_modal = true;
                    dc.menuItems[0].icon = '0408SideMenuElements_DashBtn_ScoreIconFullActive170x74.png';
                    break;
                case "talksRanks":
                    dc.gp = dc.talksRanks
                    dc.show_modal = true;
                    dc.menuItems[1].icon = '0410SideMenuElements_DashBtn_CallLenghtIconFullActive170x70.png';
                    break;
                case "politeRanks":
                    dc.gp = dc.politeRanks
                    dc.show_modal = true;
                    dc.menuItems[2].icon = '0412SideMenuElements_DashBtn_NiceIconFullActive170x70.png';
                    break;
                case "salesRanks":
                    dc.gp = dc.salesRanks
                    dc.show_modal = true;
                    dc.menuItems[3].icon = '0414SideMenuElements_DashBtn_SalesIconFullActive170x70.png';
                    break;
                case "contributesRanks":
                    dc.gp = dc.contributesRanks
                    dc.show_contributePercentage = true;
                    dc.menuItems[4].icon = '0416SideMenuElements_DashBtn_TeamIconFullActive170x70.png';
                    break;
                case "leaderBoard":
                    dc.show_leaderboard = true;
                    dc.leaderBoardData = dc.talksRanks;
                    dc.leaderBoardIndex = 0;
                    dc.leaderBoardArray = getLeaderBoardArray(dc.leaderBoardIndex);
                    dc.menuItems[5].icon = '0419SideMenuElements_BottomLeaderboardFullActive166x57.png';
                    break;
                case "firgun":
                    dc.show_firgunim = true;
                    dc.menuItems[6].icon = '0421SideMenuElements_BottomFirgunFullActive166x57.png';
                    break;

            }

            console.log(dc.gp);
            dc.title = value.name;

        }

        dc.showNext = function(){
            if ((dc.leaderBoardIndex+1) >= dc.leaderBoardData.length)
                return;
            dc.leaderBoardIndex++;
            dc.leaderBoardArray = getLeaderBoardArray(dc.leaderBoardIndex);
        }

        dc.showPref = function(){
            if (dc.leaderBoardIndex == 0)
                return;
            dc.leaderBoardIndex--;
            dc.leaderBoardArray = getLeaderBoardArray(dc.leaderBoardIndex);
        }

        


        dc.close_modal = function () {
            dc.show_modal = false;
            dc.show_firgunim = false;
            dc.menuItems[0].icon =  '0408SideMenuElements_DashBtn_ScoreIconFull170x74.png';
            dc.menuItems[1].icon =  '0410SideMenuElements_DashBtn_CallLenghtIconFull170x70.png';
            dc.menuItems[2].icon =  '0412SideMenuElements_DashBtn_NiceIconFull170x70.png';
            dc.menuItems[3].icon =  '0414SideMenuElements_DashBtn_SalesIconFull170x70.png';
            dc.menuItems[4].icon =  '0416SideMenuElements_DashBtn_TeamIconFull170x70.png';
            dc.menuItems[5].icon =  '0419SideMenuElements_BottomLeaderboardFull166x57.png';
            dc.menuItems[6].icon =  '0421SideMenuElements_BottomFirgunFull166x57.png';
            dc.menuItems[7].icon =  '0423SideMenuElements_BottomStatsFull166x57.png';

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


        dc.chooseLeaderBoardColor = function(value){
            if (value.clientSystemId == dc.currentUserProfile.clientSystemId)
                return 'Green';
            else
                return 'White';
        }
        


    }]);