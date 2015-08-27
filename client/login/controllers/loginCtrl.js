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


}]);