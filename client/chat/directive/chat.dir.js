angular.module("morimpact").directive('chat', function () {
    return {
        restrict: "EA",
        replace: false,
        scope: {
            showchat: "=",
        },
        templateUrl: 'client/chat/views/chat.ng.html',

        link: function (scope, element, attrs, ngModel) {
            console.log("chat init");

        },
        controller: function ($scope, $rootScope, $reactive, $element) {
            $reactive(this).attach($scope);
            this.subscribe('groups');
            this.subscribe('userPref');
            this.subscribe('users');
            this.currentUserProfile = Meteor.user().profile;

            this.helpers({
                    userPref: () => {
                        return UserPref.find({});
                    },
                    groups: () =>{
                        return Groups.find();
                    }
        })

        }
    }
});