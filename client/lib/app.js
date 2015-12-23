angular.module('morimpact',[
    'angular-meteor',
    'ui.router',
    'angularUtils.directives.dirPagination',
    'angularMoment','backand']);

function onReady() {
    angular.bootstrap(document, ['morimpact']);
    //Accounts.ui.config({
    //    passwordSignupFields:  "USERNAME_ONLY"
    //})
}

if (Meteor.isCordova)
    angular.element(document).on("deviceready", onReady);
else
    angular.element(document).ready(onReady);

