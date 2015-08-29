angular.module("morimpact").controller("LoginCtrl", [ '$rootScope','$meteor','$state',
  function( $rootScope,$meteor,$state){
console.log("loginCtrl");

    var loginCtrl = this;
    loginCtrl.showCreateAccount = false;
    loginCtrl.groups = $meteor.collection(Groups);
    Accounts.ui.config({
      passwordSignupFields:  "USERNAME_ONLY"
    })
    loginCtrl.createAccount = function(isValid){
      if (!isValid)
        return;
      loginCtrl.error = ""
      var email = loginCtrl.user.email;
      var username = loginCtrl.user.username;
      var password = loginCtrl.user.password;
      var firstname = loginCtrl.user.firstName;
      var lastname = loginCtrl.user.lastName;
      var groupId = loginCtrl.user.groupId;

      var user = {username:username,password:password,profile:{'email':email,name:firstname +" "+lastname,groupId:groupId}};

      Accounts.createUser(user,function(err){
        if(!err) {
          //Router.go('/');
          console.log("create Account succeess");
          $state.transitionTo('dashboard');
        }else{
          loginCtrl.error = err.reason;
        }
      });

      console.log("create Account" + isValid);
    }



    loginCtrl.login = function(isValid){
      if (!isValid)
        return;
      loginCtrl.error = ""
      var username = loginCtrl.user.username;
      var password = loginCtrl.user.password;


      Meteor.loginWithPassword(username,password,function(err){
        if(!err) {
          console.log("login Account succeess");
          $state.transitionTo('dashboard');
        }else{
          loginCtrl.error = err.reason;
        }
      });

    }


}])
    .directive('dropdown', ['$timeout', function ($timeout) {
        return {
            restrict: "EA",
            replace: true,
            scope: {
                ngModel: '=',
                data: '='
            },
            template: '<div class="ui selection dropdown"><input type="hidden" name="id"><div class="default text">Group</div><i class="dropdown icon"></i><div class="menu"><div class="item" ng-repeat="item in data" data-value="{{item._id}}">{{item.name}}</div></div></div>',
            link: function (scope, elm, attr) {
                // initialize the dropdown after angular is completely done
                // digesting this directive
                $timeout(function() {
                    elm.dropdown({
                        onChange: function(newValue) {
                            // this function is executed outside of angular's
                            // digest loop so in order to notify angular about
                            // changes to the model you need to use $apply
                            scope.$apply(function(scope) {
                                scope.ngModel = newValue;
                            });
                        }
                    });
                });
            }
        };
    }]);