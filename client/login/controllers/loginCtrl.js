angular.module("morimpact").controller("LoginCtrl", [ '$rootScope','$meteor','$state','$interval',
  function( $rootScope,$meteor,$state,$interval){
console.log("loginCtrl");

    var loginCtrl = this;
    loginCtrl.showCreateAccount = false;
    loginCtrl.groups = $meteor.collection(Groups);
    loginCtrl.fileContent = [];
    loginCtrl.stop;
    loginCtrl.saveFile = function(){
        console.log(loginCtrl.fileContent);
        var fileContentArray = loginCtrl.fileContent.split('\n');
        var fileContentArrayData = [];
        var index = 0
        loginCtrl.stop = $interval(function(){
            index++;
            if (index < fileContentArray.length){
                fileContentArrayData = fileContentArray[index].split(',');

                var user = {

                    'email': fileContentArrayData[7],
                    'password': '123456',

                    'profile': {
                        'email': fileContentArrayData[7],
                        'firstName': fileContentArrayData[1],
                        'lastName': fileContentArrayData[2],
                        'groupId': fileContentArrayData[6],
                        'phoneNumber': fileContentArrayData[8],
                        'clientSystemId': fileContentArrayData[9],
                        'userType': fileContentArrayData[11],
                        'sumPoints': fileContentArrayData[10],
                        'created': fileContentArrayData[3],
                        'updated': fileContentArrayData[4],
                        'id': fileContentArrayData[0]
                    }
                };
                Accounts.createUser(user, function (err) {
                    if (err)
                        console.log(err);
                    else
                        console.log('success!');
                });
            }else{
                loginCtrl.stop = undefined;
            }

        },3000);

    }

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
      var email = loginCtrl.user.email;
      var password = loginCtrl.user.password;


      Meteor.loginWithPassword(email,password,function(err){
        if(!err) {
          console.log("login Account succeess");
          $state.transitionTo('dashboard');
        }else{
          loginCtrl.error = err.reason;
        }
      });

    }


}])


.directive('modal', function ($rootScope) {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        require: 'ngModel',
        template: '<div class="ui modal" ng-transclude></div>',
        link: function (scope, element, attrs, ngModel) {
            element.modal({
                onHide: function () {
                    $rootScope.$broadcast("modalHide");
                    ngModel.$setViewValue(false);
                }
            });
            scope.$watch(function () {
                return ngModel.$modelValue;
            }, function (modelValue){
                element.modal(modelValue ? 'show' : 'hide');
            });
            scope.$on('$destroy',function(){
                element.modal('hide');
                element.remove();
                console.log("modal hide");
            })
        }
    }
})
    .directive('fileReader', function() {
        return {
            scope: {
                fileReader:"="
            },
            link: function(scope, element) {
                $(element).on('change', function(changeEvent) {
                    var files = changeEvent.target.files;
                    if (files.length) {
                        var r = new FileReader();
                        r.onload = function(e) {
                            var contents = e.target.result;
                            scope.$apply(function () {
                                scope.fileReader = contents;
                            });
                        };

                        r.readAsText(files[0]);
                    }
                });
            }
        };
    });

