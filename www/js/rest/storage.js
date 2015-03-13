var rest = angular.module('moduleRemoteStorage', []);

rest.service('RemoteStore', ['$http', 'Base64', function ($http, Base64) {
        
        var _credentials = 'Basic ' + Base64.encode('saintefoy:services');

        //type => 'android' or 'ios'
        this.sendDeviceID = function (type, deviceID, name, firstName, mailAdr, terms, serv, callback) {

            //alert('sendDeviceID'+ deviceID );
            $http.defaults.headers.common['Authorization'] = _credentials;
            $http.post(serv + 'saintefoy/api/device/' + type + '/' + deviceID, { data : { nom : name, prenom : firstName, mail : mailAdr, cgu : terms } }).success(function (retour) {
                if (retour.success) {
                    //TRUE or FALSE
                    
                    callback(retour);
                } else {
                    callback(retour);
                }
                
            }).error(function (data) { callback(false); });
        };

        this.getMeteoFromLast = function (serv, callback) {
            
            $http.defaults.headers.common['Authorization'] = _credentials;
            $http.get(cacheProofGetRequest(serv + 'saintefoy/api/meteo')).success(function (retour) {
                if (retour.success) {
                    /*object retour :
                            {
                                date : 12346,
                                meteo : {},
                                remontes : []
                            }
                        */
                        callback(retour.result);
                } else {
                    callback(false);
                    console.log(retour.error);
                }
                
            }).error(function (data) { callback(false); });
        
        };

        this.streamEvents = function (serv, callback) {
            
            $http.defaults.headers.common['Authorization'] = _credentials;
            $http.get(cacheProofGetRequest(serv + 'saintefoy/api/stream')).success(function (retour) {
                if (retour.success) {
                    /*array result :
                            { 
                               date : '2014-11-01',  
                               month_fr : 'Novembre',
                               month_en : 'November',
                               events : [
                                            { 
                                                eventID : 1,
                                                promoterID : 0,
                                                promoter : '',
                                                promoter_active : 0,
                                                venueID : 0,
                                                venue : '',
                                                address : '',
                                                industryID : 0,
                                                styleID : 0,
                                                style_name : '',
                                                areaID : 1,
                                                name : '',
                                                byline : '',
                                                description : '',
                                                start_date : '',
                                                end_date : '',
                                                picture : '',
                                                cost : '0',
                                                facebook : '',
                                                website : '',
                                                active : 0
                                            }, {}, {}, ...
                                    ], 
                               limit : 1234567980 
                            }
                            
                        */
                        callback(retour.result);
                } else {
                    callback(false);
                    console.log(retour.error);
                }
                
            }).error(function (data) { callback(false); });
        };
        
        this.streamNews = function (serv, callback) {
            $http.defaults.headers.common['Authorization'] = _credentials;
            $http.get(cacheProofGetRequest(serv + 'saintefoy/api/news')).success(function (retour) {
                if (retour.success) {
                    /*object result :
                            { 
                               news : [],
                               flashes : []
                            }
                     array of news like:
                            { 
                               newsID : 0,
                               title : '',
                               body : '',
                               creation : 123456789,
                               areaID : 1, 
                               promoterID : 0,
                               promoter : '',
                               promoter_active : 1,
                               venueID : 1,
                               news_venue : '',
                               news_address : '',
                               news_logo : '',
                               industryID : 0
                            }
                            
                        */
                        callback(retour.result);
                } else {
                    callback(false);
                    console.log(retour.error);
                }
                
            }).error(function (data) { callback(false); });
        };
        
        this.getVenues = function (serv, callback) {
            
            $http.defaults.headers.common['Authorization'] = _credentials;
            $http.get(cacheProofGetRequest(serv + 'saintefoy/api/venues')).success(function (retour) {
                if (retour.success) {
                    
                    callback(retour.result);
                } else {
                    callback(false);
                    console.log(retour.error);
                }
                
            }).error(function (data) { callback(false); });
        };
        
        this.getAllUpdate = function (serv, callback) {
            
            $http.defaults.headers.common['Authorization'] = _credentials;
            $http.get(cacheProofGetRequest(serv + 'saintefoy/api/update')).success(function (retour) {
                if (retour.success) {
                    
                    callback(retour.result);
                } else {
                    callback(false);
                    console.log(retour.error);
                }
                
            }).error(function (data) { callback(false); });
        };
        
        this.getPopupAds = function (serv, callback) {
            $http.defaults.headers.common['Authorization'] = _credentials;
            $http.get(cacheProofGetRequest(serv + 'saintefoy/api/popups')).success(function (retour) {
                if (retour.success) {
                    callback(retour.result);
                } else {
                    callback(false);
                    console.log(retour.error);
                }
            }).error(function (data) { callback(false); });
        };
        
        this.sendCounter = function (counter, serv, callback) {
            $http.defaults.headers.common['Authorization'] = _credentials;
            $http.post(serv + 'saintefoy/api/popCounter', { data : counter }).success(function (retour) {
                if (retour.success) {
                    callback(retour.result);
                } else {
                    callback(false);
                    console.log(retour.error);
                }
            }).error(function (data) { callback(false); });
        };

        var cacheProofGetRequest = function (url) {
            var separator = url.indexOf('?') === -1 ? '?' : '&';
            url = url + separator + 'noCache=' + new Date().getTime();
            return url;
        };
    }]);