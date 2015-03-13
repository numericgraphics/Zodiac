angular.module('zodiac.ctrl.home', [])
.controller('HomeCtrl', ['$scope', '$state', '$ionicGesture', 'Events', '$interval', '$timeout', 
    function ($scope, $state, $ionicGesture, Events, $interval, $timeout) {
        
        $scope.ended = false;
        
        var init = function () {
            //$scope.ended = false;
            //$timeout(function () {
            //    Events.triggerEvent(Events.ZODIAC_ADD_OPTION, { id: 2, name : 'Standard', weight : 1.3 });
            //}, 5000);
        };
        
        //EVENTS
        var resumeEv = null;
        var loadedEv = Events.listenEvent($scope, Events.VIEW_LOADED, function () {
            init();
            
            resumeEv = Events.listenEvent($scope, Events.ON_RESUME_APP, function (evt) {
                init();
            });
            
            //Events.listenEvent($scope, Events.ZODIAC_ADD_OPTION, function (evt) {
            //    $scope.ended = true;
            //});
            
            loadedEv();// Remove listener
        });
        
        var destroyEv = Events.listenEvent($scope, Events.VIEW_DESTROY, function (evt) {
            if (resumeEv) {
                resumeEv();
            }
            destroyEv();
        });

    }]);