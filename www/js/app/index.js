angular.module('app.controllers', [
    'zodiac.ctrl.home'])

.controller('mainController', ['$scope', 'Events', function ($scope, Events) {
        
        //INIT
        var init = function () {
            console.log('init start');
            //try {
            //    navigator.splashscreen.hide();
            //} catch (e) { alert('ERROR on navigator.splashscreen.hide'); }
            
            console.log('init end');
        };
        
        Events.listenEvent($scope, Events.APP_READY, function (evt) {
            init();
        });
        Events.listenEvent($scope, Events.VIEW_DESTROY, function (evt) {

        });
    }]);