var data = angular.module('moduleData', []);

data.service('Data', ['LocalStore', 'RemoteStore', 'Mail', '$rootScope', function (LocalStore, RemoteStore, Mail, $rootScope) {
        
        var _remoteServer = 'http://www.saintefoy-admin.eu/';

        var _lastUpdate = 0;
        var _lastUpdateWeather = 0;
        var _lastUpdateEvents = 0;
        var _lastUpdateVenues = 0;
        var _lastUpdateNews = 0;
        var _lastUpdateAds = 0;
        var _deviceKnown = false;

        var _ready = false;
        var _updating = false;
        var _callWhenReady = null;

        var _newsCount = 0;

        //On application start or once every hours 
        this.initialize = function () {
            onDeviceReady();
        };
        
        this.newsCount = function () {
            return _newsCount;
        };
        
        this.isReady = function (callback) {
            
            if (_ready) {
                callback();
            } else {
                _callWhenReady = callback;
            }
        };

        this.getMeteoFromLast = function (callback) {
            checkUpdate(LocalStore.getMeteoFromLast, callback);
        };
        
        this.streamEvents = function (callback) {
            checkUpdate(LocalStore.streamEvents, callback);
        };
        
        this.getVenues = function (callback) {
            checkUpdate(LocalStore.getVenues, callback);
        };
        
        this.getUserInfo = function (callback) {
            checkUpdate(LocalStore.getDeviceUser, callback);
        };
        
        this.getNews = function (callback) {
            //LocalStore.getNewsStream(callback);
            checkUpdate(LocalStore.getNewsStream, function (stream) {
                _newsCount = stream.length;
                callback(stream);
            });
        };
        
        this.getAdvertisement = function (callback) {
            checkUpdate(LocalStore.getPopupAds, callback);
        };

        this.getAdIndex = function (callback) {
            LocalStore.getPopupIndex(callback);
        };
        this.storeAdIndex = function (index) {
            LocalStore.storePopupIndex(index);
        };

        this.getPreference = function (callback) {
            LocalStore.getPreference(callback);
        };
        
        this.sendDeviceAndUser = function (type, deviceID, name, firstName, mailAdr, terms, callback) {
            var dev = {
                sent : false,
                brand : type, 
                key : deviceID, 
                name : name, 
                firstname : firstName, 
                email : mailAdr,
                cgu : terms
            };

            LocalStore.storeDeviceUser(dev);
            if ($rootScope.onLineStatus == 'DEVICE_ONLINE') {
                RemoteStore.sendDeviceID(type, deviceID, name, firstName, mailAdr, terms, _remoteServer, function (result) {
                    if (result) {
                        dev.sent = true;
                        _deviceKnown = true;
                        LocalStore.storeDeviceUser(dev);
                    }
                    callback(dev);
                });
            } else {
                callback(dev);
            }
        };
        
        this.sendQuestion = function (name, mail, msg, callback) {
            Mail.askQuestion(name, mail, msg, _remoteServer, callback);
        };
        
        this.sendAdCounter = function (adDisplayed) {
            //get stored ad counter
            LocalStore.getAdvertCounter(function (obj) {
                //add new counter
                if (!obj[adDisplayed.id]) {
                    obj[adDisplayed.id] = 1;
                } else {
                    obj[adDisplayed.id] += 1;
                }
                console.log('DATA sendAdCounter', obj);
                //send counter remotely
                RemoteStore.sendCounter(obj, _remoteServer, function (res) {
                    console.log('DATA RemoteStore.sendCounter', res);
                    if (res) {
                        //success => remove local counter
                        obj = {};
                        LocalStore.storeAdvertCounter(obj);
                    } else {
                         //error => store counter
                        LocalStore.storeAdvertCounter(obj);
                    }
                });
            });
        };

        this.sendServiceDemand = function (serviceName, name, mail, msg, phoneNumber, callback) {
            Mail.askService(serviceName, name, mail, msg, phoneNumber, _remoteServer, callback);
        };

        this.storeFlash = function (flash) {
            LocalStore.storeFlash(flash);
        };
        
        this.storePreference = function (prefer) {
            LocalStore.storePreference(prefer);
        };

        this.updateMeteo = function (callback) {
            RemoteStore.getMeteoFromLast(_remoteServer, function (result) {
                LocalStore.storeLastMeteo(result);
                var d = new Date().getTime() / 1000;
                d -= 1;
                _lastUpdateWeather = parseInt(d.toString());
                callback();
            });
        };

        var onDeviceReady = function () {
            $rootScope.$watch('onLineStatus', statusChanged);
            initiateDatas(function (err, result) {
                if (_callWhenReady) _callWhenReady();
                _callWhenReady = null;
                _ready = true;
            });
        };
        
        var statusChanged = function (newStatus, oldStatus) {
            if (newStatus == 'DEVICE_ONLINE') {
                initiateDatas(function (err, res) { });
            }
        };

        var checkUpdate = function (call, callback) {
            var dt = parseInt((new Date().getTime() / 1000).toString());

            //verification toutes les heures
            if ((_lastUpdate == 0) || ((_lastUpdate + 3600) < dt)) {
                initiateDatas(function (err, res) {
                    call(callback);
                });
            } else {
                call(callback);
            }
        };

        var initiateDatas = function (callback) {
            LocalStore.getStoredUpdates(function (local) { 
                _lastUpdateWeather = local.weather;
                _lastUpdateEvents = local.events;
                _lastUpdateVenues = local.venues;
                _lastUpdateNews = local.news;
                _lastUpdateAds = local.advert;
                _deviceKnown = local.device_sent;

                if (!_updating && ($rootScope.onLineStatus == 'DEVICE_ONLINE')) {
                    var counter = 0;
                    _updating = true;
                    RemoteStore.getAllUpdate(_remoteServer, function (remote) {
                        if (remote) {
                            remote.device_sent = _deviceKnown;
                            if (remote.weather > _lastUpdateWeather) {
                                counter++;
                                RemoteStore.getMeteoFromLast(_remoteServer, function (result) {
                                    if (result) {
                                        LocalStore.storeLastMeteo(result);
                                    }

                                    counter--;
                                    callEndUpdating('weather', counter, callback);
                                });
                            }
                            if (remote.events > _lastUpdateEvents) {
                                counter++;
                                RemoteStore.streamEvents(_remoteServer, function (result) {
                                    if (result) {
                                        LocalStore.storeEvents(result);
                                    }

                                    counter--;
                                    callEndUpdating('events', counter, callback);
                                });
                            }
                            if (remote.venues > _lastUpdateVenues) {
                                counter++;
                                RemoteStore.getVenues(_remoteServer, function (result) {
                                    if (result) {
                                        LocalStore.storeVenues(result);
                                    }

                                    counter--;
                                    callEndUpdating('venues', counter, callback);
                                });
                            }
                            if (remote.news > _lastUpdateNews) {
                                counter++;
                                RemoteStore.streamNews(_remoteServer, function (result) {
                                    if (result) {
                                        LocalStore.storeNews({ news : result.news });
                                        LocalStore.storeFlashes({ flashes : result.flashes });
                                        $rootScope.$broadcast('flashUpdate');
                                    }

                                    counter--;
                                    callEndUpdating('news', counter, callback);
                                });
                            }
                            if (remote.advert > _lastUpdateAds) {
                                counter++;
                                RemoteStore.getPopupAds(_remoteServer, function (result) {
                                    if (result) {
                                        LocalStore.storePopupAds(result);
                                    }
                                    
                                    counter--;
                                    callEndUpdating('advert', counter, callback);
                                });
                            }
                            if (!_deviceKnown) {
                                //counter++;
                                LocalStore.getDeviceUser(function (dev) {
                                    if (dev.key != null && dev.key != '' && dev.key != undefined) {
                                        RemoteStore.sendDeviceID(dev.brand, dev.key, dev.name, dev.firstName, dev.email, _remoteServer, function (result) {
                                            if (result) {
                                                dev.sent = true;
                                                LocalStore.storeVenues(dev);
                                                remote.device_sent = true;
                                                _deviceKnown = remote.device_sent;
                                            }

                                            counter--;
                                            callEndUpdating('device', counter, callback);
                                        });
                                    }
                                });
                            }
                            
                            LocalStore.storeUpdates(remote);
                            _lastUpdateWeather = remote.weather;
                            _lastUpdateEvents = remote.events;
                            _lastUpdateVenues = remote.venues;
                            _lastUpdateNews = remote.news;
                            _lastUpdateAds = remote.advert;
                            
                            _lastUpdate = parseInt((new Date().getTime() / 1000).toString());
                            
                            callEndUpdating('MASTER', counter, callback);
                            
                        } else {
                            if (callback) {
                                callback(new Error(remote.error), null);
                            }
                        }
                    });
                } else {
                    if (callback) {
                        callback(new Error('No Network'), null);
                    }
                }
            });
            
        };

        var callEndUpdating = function (name, count, callFunction) {
            if ((count <= 0) && (callFunction)) {
                callFunction(null, true);
                _updating = false;
            }
        };

    }]);