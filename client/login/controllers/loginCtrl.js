angular.module("morimpact").controller("LoginCtrl", [ '$rootScope','$meteor','$state',
  function( $rootScope,$meteor,$state){
console.log("loginCtrl");

    var loginCtrl = this;
    loginCtrl.showCreateAccount = false;

    loginCtrl.createAccount = function(isValid){
      if (!isValid)
        return;
      loginCtrl.error = ""
      var email = loginCtrl.user.email;
      var password = loginCtrl.user.password;
      var firstname = loginCtrl.user.firstName;
      var lastname = loginCtrl.user.lastName;

      var user = {'email':email,password:password,profile:{name:firstname +" "+lastname}};

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


}]);