angular.module('starter', ['ionic',
    'app.services',
    'app.controllers',
    'app.directives'
])
.config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', '$compileProvider', function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $compileProvider) {
        
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|blob|cdvfile):|data:image\//);
        
        $ionicConfigProvider.views.transition('android');
        $ionicConfigProvider.navBar.transition('android');
        
        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        
        $stateProvider.state('home', {
            url: '/home',
            templateUrl: 'js/app/home/home.html',
            controller: 'HomeCtrl'
        });
        
        $urlRouterProvider.otherwise('/home');
    }])

.run(['$ionicPlatform', '$rootScope', '$timeout', 'Events', 
    function ($ionicPlatform, $rootScope, $timeout, Events) {
        
        var _firstReady = true;

        document.addEventListener("deviceready", function () {
            startOnReady();
        }, false);
        
        $ionicPlatform.ready(function () {
            //INITIALIZE WHEN NEEDED  
            try {
                
            } catch (e) { alert('Initializing error'); }
            
            document.addEventListener("pause", onPause, false);
            startOnReady();
        });
        
        function startOnReady() {
            if (_firstReady) {
                Events.triggerEvent(Events.APP_READY);
            } else {
                _firstReady = true;
            }
        };
        function onPause() {
            document.removeEventListener("pause", onPause);
            document.addEventListener("resume", onResume, false);
            
            Events.triggerEvent(Events.ON_PAUSE_APP);
        };
        function onResume() {
            document.removeEventListener("resume", onResume);
            document.addEventListener("pause", onPause, false);
            
            //RESET APP AND HOME CONTROLLER
            Events.triggerEvent(Events.ON_RESUME_APP);
        };
    }]);