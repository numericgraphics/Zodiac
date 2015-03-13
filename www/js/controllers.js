angular.module('starter.controllers', ['moduleData', 'networkInformation', 'pushnotification', 'moduleData'])

.controller('DashCtrl', function ($scope) {
})

.controller('FriendsCtrl', function ($scope, Friends) {
    $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function ($scope, $stateParams, Friends) {
    $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function ($scope) {
})

.controller('StationVillageCtrl', function ($scope) {

    //PDF
        $scope.loadPDFStation = function (index) {
            window.open("http://www.thesummits.eu/shared/miscelaneous/sainte-foy-plan-station.pdf", '_system', 'location=no');

        };
        $scope.loadPDFVillages = function (index) {
            window.open("http://www.thesummits.eu/shared/miscelaneous/sainte-foy-plan-commune.pdf", '_system', 'location=no');

        };

})

.controller('onlineSkipassCtrl',  function ($scope, $rootScope) {

    $scope.gotoPaymentWebsite = function (item) {

        var tempURL = "";
        if ($rootScope.isFrench == true) {
                tempURL = "http://www.saintefoy-ski.com/fr/";
            } else {
                tempURL = "http://www.saintefoy-ski.com/en/";
            }
           window.open(tempURL, '_system', 'location=no'); 
        };

})

.controller('HomeCtrl', ['$scope', '$timeout', '$rootScope', '$state', 'Data', '$ionicSideMenuDelegate', 'gettextCatalog', 'GeoLocationService', 'AssetManagementService', 'MeteoTranslate',
    function ($scope, $timeout, $rootScope, $state, Data, $ionicSideMenuDelegate, gettextCatalog, GeoLocationService, AssetManagementService, MeteoTranslate) {
        
        $scope.myActiveSlide = 0;
        $scope.arrayNews = [];
        $scope.arrayUserInfos = [];
        $scope.showWelcome = true;
        $scope.showMeteo = false;
        $scope.modelMeteo = {};

        $rootScope.$watch('onLineStatus', function (newValue, oldValue) {
            if (newValue == 'DEVICE_OFFLINE') $scope.isEnabled = true;
            if (newValue == 'DEVICE_ONLINE') $scope.isEnabled = false;
        });
        
        var initializeApp = function () {
            Data.getUserInfo(function (res) {
                if (res) {
                    $scope.arrayUserInfos = res;
                }
                Data.getPreference(function (pref) {
                    if (pref) {
                        $rootScope.preference = pref;
                        if ($rootScope.preference.language == 'fr') {
                            $rootScope.onToggleLanguage();
                        }
                    }
                    updateNews();
                    displayWeather();
                });
            });
        };
        var updateNews = function () {
            Data.getNews(function (res) {

                if (res) {
                    var l = res.length;
                    for (var i = 0; i < l; i++) {
                        res[i].logotag = 'img/logo-st-foy.png';
                        res[i].picturebody = '';
                    }
                    $scope.arrayNews = res;
                    $rootScope.updateNewsCount($scope.arrayNews.length);

                    checkNewsImage(0);
                } else {
                    $scope.arrayNews = [];
                    $rootScope.updateNewsCount(0);
                }
            });
        };
        var checkNewsImage = function (i) {
            if (i < $scope.arrayNews.length) {
                if ($scope.arrayNews[i].newsID) {
                    AssetManagementService.getVenueImage($scope.arrayNews[i].news_logo, function (err, result) {
                        if (!err) {
                            $scope.arrayNews[i].logotag = result.nativeURL;
                        }
                        if ($scope.arrayNews[i].picture && ($scope.arrayNews[i].picture.length > 0)) {
                            $timeout(function () {
                                checkNewsPictureBody(i);
                            }, 1);
                        } else {
                            var index = i + 1;
                            
                            $timeout(function () {
                                checkNewsImage(index);
                            }, 1);
                        }
                    
                    });
                } else {//IS FLASH, NO PICTURE
                    var index = i + 1;
                    $timeout(function () {
                        checkNewsImage(index);
                    }, 1);
                }
            }
        };
        var numNewsUpdate = function(){
            var b = $scope.arrayNews.shift();
            $scope.arrayNews.push(b);
        };
        var checkNewsPictureBody = function (i) {
            if (i < $scope.arrayNews.length) {
                AssetManagementService.getNewsImage($scope.arrayNews[i].picture, function (err, result) {
                    if (!err) {
                        $scope.arrayNews[i].picturebody = result.nativeURL;
                    }
                    var index = i + 1;
                    
                    $timeout(function () {
                        checkNewsImage(index);
                    }, 1);
                });
            }
        };
        
        var displayWeather = function () {
            Data.getMeteoFromLast(function (resM) {
                if (resM) {
                    $scope.showMeteo = true;
                    $scope.modelMeteo = MeteoTranslate.extractMeteo(resM, $rootScope.preference.language);
                } else {
                    $scope.showMeteo = false;
                    $scope.modelMeteo = {};
                }
            });
        };
        
        Data.isReady(initializeApp);
        $scope.openCard = true;
        $scope.setCardState = function(){
            $scope.openCard = !$scope.openCard;
            console.log("setCardState", $scope.openCard);
        }

        $scope.isNews = function (item) {
            return item.newsID != undefined;
        };
        
        $scope.$on('flashUpdate', function (event) {
            updateNews();
        });
        
        $scope.$on('getUserInformations', function () {
            $scope.arrayUserInfos = $rootScope.userInformations;
        });
        
        $rootScope.$on('gettextLanguageChanged', function () {
            displayWeather();
        });

        //PDF
        $scope.loadPDF = function (index) {
            window.open("http://www.thesummits.eu/shared/miscelaneous/sainte-foy-plan-station.pdf", '_system', 'location=no');

        };

        $scope.onToggleChange = $rootScope.onToggleLanguage;
        
        $scope.onSwipeLeft = function () {
            $ionicSideMenuDelegate.toggleLeft();
        };

        $scope.clickCategory = function (url) {
            $state.go(url);
            $rootScope.categoryClick();

            $scope.showWelcome = false;
            updateNews();
            displayWeather();
        };
    }])

.controller('splashscreenCtrl', ['$scope', '$state', '$timeout', function ($scope, $state, $timeout) {
        console.log('splashscreenCtrl');
        var timer = $timeout(function () {
            $state.go('menu.home');
        }, 5000);
        
        $scope.$on("$destroy", function (event) {
            $timeout.cancel(timer);
        });

    }])

.controller('planCtrl', ['$scope', 'Data', function ($scope, Data) {
        var textBlockHeight = 0; //60
        var containerMap = document.getElementById('containerMap');
        var sizeRef = containerMap.offsetWidth > (containerMap.offsetHeight - textBlockHeight) ? containerMap.offsetWidth : (containerMap.offsetHeight - textBlockHeight);
        var sizeImg = 849;
        
        if (sizeRef < sizeImg) {
            $scope.minZoom = sizeRef / sizeImg;
        } else {
            $scope.minZoom = 1;
        }
        
        $scope.isAlert = false;
        
        var checkForAlert = function (domain) {
            
            var lr = domain.remontes.length, ld, lp;
            for (var i = 0; i < lr; i++) {
                ld = domain.remontes[i].remontes.length;
                for (var j = 0; j < ld; j++) {
                    if (domain.remontes[i].remontes[j].modif || !domain.remontes[i].remontes[j].ouvert) {
                        return true;
                    }
                }
                lp = domain.remontes[i].pistes.length;
                for (var k = 0; k < lp; k++) {
                    if (domain.remontes[i].pistes[k].modif || !domain.remontes[i].pistes[k].ouvert) {
                        return true;
                    }
                }
            }
            return false;
        };
        
        //Data.getMeteoFromLast(function (res) {
        //    $scope.isAlert = checkForAlert(res);
        //});
    }])

.controller('secoursCtrl', ['$scope', 'GeoLocationService', function ($scope, GeoLocationService) {
        
        $scope.lat;
        $scope.long;
        
        $scope.init = function () {
            var position = GeoLocationService.getPosition(function (pos) {
                if (pos) {
                    $scope.lat = pos.lat;
                    $scope.long = pos.long;
                }
            });
            $scope.lat = position.lat;
            $scope.long = position.long;
        };

    }])

.controller('meteoCtrl', ['$scope', 'Data', '$rootScope', 'PushProcessingService', function ($scope, Data, $rootScope, PushProcessingService) {
        var id = '1';
        $scope.meteoDate = 0;
        $scope.resume = {};
        $scope.bulletin = {};
        $scope.domaines = [];
        var namesArray = [];
        var i = 0;
        
        Data.getMeteoFromLast(function (res) {
            $scope.meteoDate = res.date;
            $scope.bulletin = res.meteo.zones;
            $scope.domaine = res.remontes;
        });
        
        $scope.$on('meteoUpdate', function (event) {
            Data.getMeteoFromLast(function (res) {
                $scope.meteoDate = res.date;
                $scope.bulletin = res.meteo.zones;
                $scope.domaine = res.remontes;
            });
        });
        
        $scope.range = function (min, max, step) {
            step = step || 1;
            var input = [];
            for (var i = min; i < max; i += step) input.push(i);
            return input;
        };
        
        $scope.toggleGroup = function (group) {
            if ($scope.isGroupShown(group)) {
                $scope.shownGroup = null;
            } else {
                $scope.shownGroup = group;
            }
        };
        $scope.isGroupShown = function (group) {
            return $scope.shownGroup === group;
        };

    }])

.controller('horairesCtrl', ['$scope', '$location', '$ionicScrollDelegate', '$timeout', function ($scope, $location, $ionicScrollDelegate, $timeout) {
        $scope.horaires = [];
        $scope.init = function () {
            
            $scope.horaires = [	
                {
                    titre: "MORNING", obj: [{ text: "CHEF LIEU", hours: 8, minute: 30 },
				    { text: "STATION", hours: 8, minute: 50 },
				    { text: "MIROIR", hours: 9, minute: 15 },
				    { text: "CHEF LIEU", hours: 9, minute: 25 },
				    { text: "STATION", hours: 9, minute: 50 },
				    { text: "CHEF LIEU", hours: 10, minute: 15 },
				    { text: "STATION", hours: 10, minute: 45 },
				    { text: "MIROIR", hours: 11, minute: 10 },
                    { text: "CHEF LIEU", hours: 11, minute: 20 },
                    { text: "STATION", hours: 11, minute: 45 }
                    ]
                },
                {
                    titre: "AFTERNOON", obj: [{ text: "STATION", hours: 12, minute: 30 },
				    { text: "MIROIR", hours: 12, minute: 50 },
				    { text: "CHEF LIEU", hours: 13, minute: '00' },
				    { text: "STATION", hours: 13, minute: 30 },
				    { text: "CHEF LIEU", hours: 15, minute: 30 }]
                },
                {
                    titre: "LATE AFTERNOON", obj: [{ text: "STATION", hours: 16, minute: 40 },
				    { text: "CHEF LIEU", hours: 17, minute: '00' },
				    { text: "MIROIR", hours: 17, minute: '05' },
				    { text: "STATION", hours: 17, minute: 30 },
				    { text: "CHEF LIEU", hours: 18, minute: '00' },
                    { text: "MIROIR*", hours: 18, minute: 10 }
                    ]
                }
            ];
            
            var result = [];
            var datesArray = [];
            var now = new Date();
            var timer;
            
            for (var i = 0; i < $scope.horaires.length; i++) {
                for (var j = 0; j < $scope.horaires[i].obj.length; j++) {
                    datesArray.push($scope.horaires[i].obj[j]);
                }
            }
            
            for (var k = 0; k < datesArray.length; k++) {
                var later = new Date();
                later.setHours(datesArray[k].hours);
                later.setMinutes(datesArray[k].minute);
                if (later >= now) {
                    result.push(later);
                }
            }
            
            if (result.length != 0) {
                findNextNavette(result[0]);
                timer = $timeout(function () {
                    $ionicScrollDelegate.$getByHandle('mainScrollHoraire').anchorScroll($location.hash("item_true"));
                }, 1000);
            }

        };
        
        
        var findNextNavette = function (nextHour) {
            for (var i = 0; i < $scope.horaires.length; i++) {
                for (var j = 0; j < $scope.horaires[i].obj.length; j++) {
                    if ($scope.horaires[i].obj[j].hours == nextHour.getHours() && $scope.horaires[i].obj[j].minute == nextHour.getMinutes()) {
                        $scope.horaires[i].obj[j].isSelected = true;
                    } else {
                        $scope.horaires[i].obj[j].isSelected = false;
                    }
                
                }
            }
        };
        
        $scope.$on("$destroy", function (event) {
            if (typeof timer != 'undefined') $timeout.cancel(timer);
        });

    }])

.controller('commercesCtrl', ['$scope', 'Data', '$ionicModal', 'AssetManagementService', function ($scope, Data, $ionicModal, AssetManagementService) {
        
        $scope.stream = [];
        $scope.selectedShop = null;
        
        Data.getVenues(function (res) {
            $scope.stream = res;
        });
        
        $scope.toggleGroup = function (group) {
            if ($scope.isGroupShown(group)) {
                $scope.shownGroup = null;
            } else {
                $scope.shownGroup = group;
            }
        };
        
        $scope.isGroupShown = function (group) {
            return $scope.shownGroup === group;
        };
        
        var openDefault = function (shop) {
            $ionicModal.fromTemplateUrl('templates/modalCommerces.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;
                AssetManagementService.getVenueImage(shop.picture, function (err, result) {
                    // $scope.selectedShop = item;
                    if (err) {
                        $scope.selectedShop.picturetag = 'img/logo.png';
                    } else {
                        $scope.selectedShop.picturetag = result.nativeURL;
                    }
                    
                    $scope.modal.show();
                });
            });
        };
        
        $scope.clickItem = function (index, shop) {
            $scope.selectedShop = shop;

            if (shop.templateApp && (shop.templateApp.active)) {
                AssetManagementService.getTemplate(shop.templateApp, function (err, result) {
                    if (err) {
                        openDefault(shop);
                    } else {
                        $ionicModal.fromTemplateUrl(result.nativeURL, {
                            scope: $scope,
                            animation: 'slide-in-up'
                        }).then(function (modal) {
                            $scope.modal = modal;
                            $scope.selectedShop.assetDir = AssetManagementService.templateDirectory() + shop.templateApp.name + '/assets/';
                            $scope.modal.show();
                        });
                    }
                });
            } else {
                openDefault(shop);
            }
        };
        
        $scope.closeModal = function () {
            
            $scope.selectedShop.picturetag = null;
            delete $scope.selectedShop.picturetag;
            $scope.selectedShop.assetDir = null;
            delete $scope.selectedShop.assetDir;

            $scope.selectedShop = null;

            $scope.modal.remove();
        };
        
        $scope.onClickDetail = function (url) {
            window.open(url, '_system', 'location=yes');
        };

    }])

.controller('agendaCtrl', ['$scope', '$ionicModal', 'Data', '$rootScope', 'NetworkInformationService', '$ionicScrollDelegate', '$timeout', '$location', function ($scope, $ionicModal, Data, $rootScope, NetworkInformationService, $ionicScrollDelegate, $timeout, $location ) {
        
        $scope.animation = "";
        $scope.date = "";
        $scope.stream = [];
        $scope.selectedEvent = {};
        
        var mapContent = document.getElementById('mapContent');
        var mapScroll = document.getElementById('mapScroll');
        
        Data.streamEvents(function (res) {
            $scope.stream = res;
        });
        
        //MODAL /////////////////////////
        $ionicModal.fromTemplateUrl('templates/modalAgenda.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });
        
        $scope.openModal = function (event) {
            $scope.selectedEvent = event;
            $scope.modal.show();
        };
        
        $scope.closeModal = function () {
            $scope.modal.hide();
        };
        
        $scope.onClickDetail = function (url) {
            window.open(url, '_system', 'location=yes');
        };
        
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });

        var date = new Date();
        var tab_Month=new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
        var currentMonth = tab_Month[date.getMonth()];

        var findMonth = function () {
            for (var i = 0; i < $scope.stream.length; i++) {
                if($scope.stream[i].month_en == currentMonth){
                    $scope.stream[i].isSelected = true;
                    console.log("select month : ", $scope.stream[i].month_en);
                } else {
                        $scope.stream[i].isSelected = false;
                }
                
                //for (var j = 0; j < $scope.horaires[i].obj.length; j++) {
                //    if ($scope.horaires[i].obj[j].hours == nextHour.getHours() && $scope.horaires[i].obj[j].minute == nextHour.getMinutes()) {
                //        $scope.horaires[i].obj[j].isSelected = true;
                //    } else {
                //        $scope.horaires[i].obj[j].isSelected = false;
                //    }
                
                //}
            }
        };
         
        findMonth();
        timer = $timeout(function () {
            $ionicScrollDelegate.$getByHandle('mainScrollHoraire').anchorScroll($location.hash("item_true"));
        }, 1000);

    }])

.controller('webcamsCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
        $scope.onLoadingDone = false;
        
        $timeout(function () {
            $scope.onLoadingDone = true;
        }, 3000);
        
        var pic_url = "http://80.13.177.54/record/current.jpg";  //Live Mobotix camerabeeld
        var CamPic = document.getElementsByName("CamPic")[0];
        self.name = "mxStart10__0__70__62";
        var hostname;
        
        var timer;
        
        var n = Math.floor(Math.random() * 1000000);
        var noframepath = "images/main/mobotix/alt.gif";                 //Niet beschikbaar beeld
        var startn = n;
        var GetItOn = 1;
        var recordmult = 1;
        var buffer = new Image();
        var aktiv = null;
        var passiv = null;
        
        var DoComplete = function () {
            CamPic.src = buffer.src;
            GetItOn = 1;
            if (recordmult == -2)
                LoadNext();
        };
        var LoadError = function () {
            CamPic.src = noframepath;
            GetItOn = 1;
            if (recordmult == -2)
                timer = $timeout("LoadNext();", 500);
        };
        var LoadNext = function () {
            buffer.onload = DoComplete;
            buffer.onerror = LoadError;
            buffer.src = pic_url + "?sync=1&rand=" + String(n++);
        };
        var setframerate = function () {

        };
        window.Animation = function () {
            
            if (GetItOn == 1) {
                if ((CamPic.width < 160) || (CamPic.height < 120))
                    buffer.onerror = LoadError;
                buffer.onload = DoComplete;
                buffer.src = pic_url + "?rand=" + String(n++);
                GetItOn = 0;
            }
        };
        
        aktiv = window.setInterval("window.Animation()", 1000 * 0.500);
        
        $scope.$on("$destroy", function (event) {
            if (timer) $timeout.cancel(timer);
            if (aktiv) clearInterval(aktiv);
        }
        );

    }])

.controller('itinerairesCtrl', ['$scope', function ($scope) {
  
    }])

.controller('servicesCtrl', ['$scope', 'Data', '$rootScope', '$timeout', function ($scope, Data, $rootScope, $timeout) {
        $scope.isSendMessageDone = false;
        $scope.dataSend = {};
        $scope.sendUserServices = function () {
            Data.sendServiceDemand($scope.dataSend.service, 
                $rootScope.userInformations.name, 
                $rootScope.userInformations.email, 
                $scope.dataSend.message, 
                $scope.dataSend.phone, 
                function (res) {
                if (res == true) {
                    $scope.isSendMessageDone = true;
                    $timeout(function () {
                        $scope.isSendMessageDone = false;
                    }, 6000);
                }
            });
        };
    }])

.controller('OpenScreenCtrl', function ($scope, $state, $ionicLoading, $timeout) {
    
    $scope.onClickEnter = function () {
        
        // Setup the loader
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: false,
            maxWidth: 200,
            showDelay: 0
        });
        
        // Set a timeout to clear loader, however you would actually call the $ionicLoading.hide(); method whenever everything is ready or loaded.
        $timeout(function () {
            $ionicLoading.hide();
            $state.go('tab.dash');
        }, 2000);

    };

});

