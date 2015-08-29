angular.module('morimpact',[
    'angular-meteor',
    'ui.router']);

function onReady() {
    angular.bootstrap(document, ['morimpact']);
}

if (Meteor.isCordova)
    angular.element(document).on("deviceready", onReady);
else
    angular.element(document).ready(onReady);

