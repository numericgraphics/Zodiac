angular.module('starter', ['ionic', 
    //'ionic.contrib.ui.tinderCards',
    //'moduleTdCard',
    'moduleSwipeCard',
    'ionic.contrib.ui.cards',
    'ngSanitize',
    'starter.controllers', 
    'starter.services', 
    'moduleLocalStorage',
    'pushnotification', 
    'geolocation', 
    'networkInformation', 
    'gettext', 
    'moduleRemoteStorage', 
    'moduleMailing',
    'assets',
    'advertisement',
    'tools',
    'moduleData'])

.run(['$ionicPlatform', 'PushProcessingService', 'GeoLocationService', 'NetworkInformationService', 'AssetManagementService', 'gettextCatalog', 'Data', 'AdService',
    function ($ionicPlatform, PushProcessingService, GeoLocationService, NetworkInformationService, AssetManagementService, gettextCatalog, Data, AdService) {
        
        $ionicPlatform.ready(function () {
            
            //TRADUCTION
            gettextCatalog.currentLanguage = 'en';
            gettextCatalog.debug = true;
            
            //TEST  
            Data.initialize();

            PushProcessingService.initialize();
            GeoLocationService.initialize();
            NetworkInformationService.initialize();
            AssetManagementService.initialize();
            AdService.initialize();
        });

    }])

.config(['$compileProvider', function ($compileProvider) {
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|blob|cdvfile):|data:image\//);
    }])

.config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
        
        $ionicConfigProvider.views.transition('android');
        $ionicConfigProvider.navBar.transition('android');
        
        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js

        $stateProvider.state('home', {
            url: '/home',
            templateUrl: 'templates/home.html',
            controller: 'HomeCtrl'
        })
        .state('splashscreen', {
            url: '/splashscreen',
            templateUrl: 'templates/splashscreen.html',
            controller: 'splashscreenCtrl'
        })
        .state('menu', {
            url: "/menu",
            abstract: true,
            templateUrl: "templates/menu.html"
        })
        .state('menu.secours', {
            url: '/secours',
            views: {
                'container': {
                    templateUrl: 'templates/secours.html',
                    controller: 'secoursCtrl'
                }
            }
        })
        .state('menu.plan', {
            url: '/plan',
            views: {
                'container': {
                    templateUrl: 'templates/plan.html',
                    controller: 'planCtrl'
                }
            }
        })
        .state('menu.planStationVillage', {
            url: '/planStationVillage',
            views: {
                'container': {
                    templateUrl: 'templates/planStationVillage.html',
                    controller: 'StationVillageCtrl'
                }
            }
        })
        .state('menu.meteo', {
            url: '/meteo',
            views: {
                'container': {
                    templateUrl: 'templates/meteo.html',
                    controller: 'meteoCtrl'
                }
            }
        })
        .state('menu.horaires', {
            url: '/horaires',
            views: {
                'container': {
                    templateUrl: 'templates/horaires.html',
                    controller: 'horairesCtrl'
                }
            }
        })
        .state('menu.agenda', {
            url: '/agenda',
            views: {
                'container': {
                    templateUrl: 'templates/agenda.html',
                    controller: 'agendaCtrl'
                }
            }
        })
        .state('menu.onlineSkipass', {
            url: '/onlineSkipass',
            views: {
                'container': {
                    templateUrl: 'templates/onlineSkipass.html',
                    controller: 'onlineSkipassCtrl'
                }
            }
        })
        .state('menu.itineraires', {
            url: '/itineraires',
            views: {
                'container': {
                    templateUrl: 'templates/itineraires.html',
                    controller: 'itinerairesCtrl'
                }
            }
        })
        .state('menu.commerces', {
            url: '/commerces',
            views: {
                'container': {
                    templateUrl: 'templates/commerces.html',
                    controller: 'commercesCtrl'
                }
            }
        })
        .state('menu.services', {
            url: '/services',
            views: {
                'container': {
                    templateUrl: 'templates/services.html',
                    controller: 'servicesCtrl'
                }
            }
        })
        .state('menu.webcams', {
            url: '/webcams',
            views: {
                'container': {
                    templateUrl: 'templates/webcams.html',
                    controller: 'webcamsCtrl'
                }
            }
        });
        
        $urlRouterProvider.otherwise('/home');
    }])

.filter('hrefToJS', ['$sce', '$sanitize', function ($sce, $sanitize) {
        return function (text) {
            var regex = /href="([\S]+)"/g;
            var newString = $sanitize(text).replace(regex, "onClick=\"window.open('$1', '_system', 'location=yes')\" href=\"\"");
            return $sce.trustAsHtml(newString);
        };
    }])

.factory('Base64', function () {
    var keyStr = 'ABCDEFGHIJKLMNOP' +
    'QRSTUVWXYZabcdef' +
    'ghijklmnopqrstuv' +
    'wxyz0123456789+/' +
    '=';
    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
            
            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
                
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
                
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
                
                output = output +
                keyStr.charAt(enc1) +
                keyStr.charAt(enc2) +
                keyStr.charAt(enc3) +
                keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);
            
            return output;
        },
        
        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
            
            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                alert("There were invalid base64 characters in the input text.\n" +
                "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
            
            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));
                
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
                
                output = output + String.fromCharCode(chr1);
                
                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
                
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);
            
            return output;
        }
    };
})

.controller('mainController', ['$scope', '$rootScope', '$timeout', '$ionicModal', 'gettextCatalog', 'Data', 'AdService', 'PushProcessingService', '$ionicSideMenuDelegate', 
    function ($scope, $rootScope, $timeout, $ionicModal, gettextCatalog, Data, AdService, PushProcessingService, $ionicSideMenuDelegate) {
        
        $rootScope.isFrench = false;
        $rootScope.userInformations = {}; //key, cgu, name, firstname, email
        $rootScope.preference = { language : 'en' }; //language
        $rootScope.onLineStatus = 'DEVICE_ONLINE';

        $scope.data = {};
        $scope.isUserInformationsDone;
        $scope.isSendMessageDone = false;
        $scope.numNews;
        
        var tenMinutes = 600000;
        var thirtySeconds = 30000;
        var count = 0;
        var popupWaiting = false;
        var isModalShow = false;

        //TRADUCTION
        $rootScope.onToggleLanguage = function () {
            $rootScope.isFrench = !$rootScope.isFrench;

            if ($rootScope.isFrench == true) {
                gettextCatalog.currentLanguage = 'fr';
                $rootScope.preference.language = 'fr';
            } else {
                gettextCatalog.currentLanguage = 'en';
                $rootScope.preference.language = 'en';
            }
            Data.storePreference($rootScope.preference);
            $rootScope.$broadcast('gettextLanguageChanged');
        };
        
        $rootScope.categoryClick = function () {
            //console.log('categoryClick', count);
            if (count == 0) {
                startPopTimer(15000);
            }
            if (count > 4) {
                count = 0;
                startPopTimer(5000);
            }
            count++;
        };
        
        var startPopTimer = function (delay) {
            console.log('start popup timer');
            $timeout(function () {
                AdService.getNextAd(function (err, file) {
                    if (err) {
                        console.log('erreur chargement publicité :', err.message);
                        $scope.openModal(3);
                    } else {
                        $scope.display = file.path;
                        $scope.openModal(4);
                        Data.sendAdCounter(file);
                    }
                });
            }, delay);
        };
        
        $rootScope.updateNewsCount = function (nc) {
            $scope.numNews = nc;
        };
        
        // TEMPLATE MODALE
        $ionicModal.fromTemplateUrl('templates/modalFooter.html', {
            id: '1',
            scope: $scope,
            backdropClickToClose: false,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal1 = modal;
        });
        
        $ionicModal.fromTemplateUrl('templates/modalInscription.html', {
            id: '2',
            scope: $scope,
            backdropClickToClose: false,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal2 = modal;
        });
        
        $ionicModal.fromTemplateUrl('templates/modalPub.html', {
            id: '3',
            scope: $scope,
            backdropClickToClose: false,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal3 = modal;
        });

        $ionicModal.fromTemplateUrl('templates/modalPubDisplay.html', {
            id: '4',
            scope: $scope,
            backdropClickToClose: false,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal4 = modal;
        });
        
        // FUNCTION MODAL
        $scope.openModal = function (index) {
            if (index == 1) {
                $scope.modal1.show();
                isModalShow = true;
            }
            if (index == 2) {
                $scope.modal2.show();
                isModalShow = true;
            }
            if (index == 3) {
                $scope.modal3.show();
                isModalShow = true;
            }
            if (index == 4) {
                $scope.modal4.show();
                isModalShow = true;
            }
        };
        
        $scope.closeModal = function (index) {
            if (index == 1) $scope.modal1.hide();
            if (index == 2) $scope.modal2.hide();
            if (index == 3) $scope.modal3.hide();
            if (index == 4) $scope.modal4.hide();
            isModalShow = false;
        };

        $scope.closeModalwithoutSigning = function(){
            
            $scope.isUserInformationsDone = true;
            $rootScope.userInformations.key = PushProcessingService.getRegisterID();
            var devType = 'ios';
            if (ionic.Platform.isAndroid()) {
                devType = 'android';
            }

            Data.sendDeviceAndUser(devType, $rootScope.userInformations.key, '', '', '', $rootScope.userInformations.cgu, function (res) {
                $rootScope.userInformations = res;
                $rootScope.$broadcast('getUserInformations');
                $timeout(function () {
                    $scope.closeModal(2);
                }, 1000);
            });
        };
        
        $scope.closeModalUserInformation = function () {
            // send userInformation and PushProcessingService.getRegisterID()
            
            $scope.isUserInformationsDone = true;
            $rootScope.userInformations.key = PushProcessingService.getRegisterID();
            var devType = 'ios';
            if (ionic.Platform.isAndroid()) {
                devType = 'android';
            }

            Data.sendDeviceAndUser(devType, $rootScope.userInformations.key, $rootScope.userInformations.name, $rootScope.userInformations.firstname, $rootScope.userInformations.email, $rootScope.userInformations.cgu, function (res) {
                
                $rootScope.userInformations = res;
                $rootScope.$broadcast('getUserInformations');
                $timeout(function () {
                    $scope.closeModal(2);
                }, 1000);
            });
        };

        $scope.onToggleChange = $rootScope.onToggleLanguage;

        $scope.sendUserMessage = function () {//name, mail, msg, callback
            Data.sendQuestion($rootScope.userInformations.name, $rootScope.userInformations.email, $scope.data.message, function (res) {
                if (res == true) {
                    $scope.isSendMessageDone = true;
                    $timeout(function () {
                        $scope.closeModal(1);
                        $scope.isSendMessageDone = false;
                    }, 2000);
                }
            });
        };
        
        $scope.onSwipeLeft = function () {
            $ionicSideMenuDelegate.toggleLeft();
            
        };

        $scope.onBackButton = function () {
        };
        
        $scope.openCGU = function () {
            window.open('http://www.saintefoy-admin.eu/cgu.html', '_system', 'location=yes');
        };
        
        $scope.$on('$destroy', function () {
            $scope.modal1.remove();
            $scope.modal2.remove();
            $scope.modal3.remove();
            $scope.modal4.remove();
        });
        
        window.onresize = function (event) {
            $scope.deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
            $scope.deviceHeight = (window.innerheight > 0) ? window.innerheight : screen.height;
        };
        
        window.onresize();
        
        //VERIF OPENING
        $timeout(function () {
            Data.getUserInfo(function (res) {
                if (res.key == null || res.key == '' || res.key == undefined) {
                    $scope.isUserInformationsDone = false;
                    $scope.openModal(2);
                } else {
                    $rootScope.userInformations = res;
                }

            });
        }, 500);

    }]);

