var store = angular.module('moduleLocalStorage', []);

rest.service('LocalStore', ['$window', function ($window) {
        var _default = '{ \"weather\" : 0, \"events\" : 0, \"venues\" : 0, \"news\" : 0, \"advert\" : 0, \"device_sent\" : false }';
        var _pref = '{ \"language\" : \"en\" }';
        
        this.streamEvents = function (callback) {
            callback(JSON.parse($window.localStorage['saintfoyapp_events'] || '{}'));
        };
        this.storeEvents = function (events) {
            $window.localStorage['saintfoyapp_events'] = JSON.stringify(events);
        };
        
        this.getMeteoFromLast = function (callback) {
            callback(JSON.parse($window.localStorage['saintfoyapp_meteo'] || '{}'));
        };
        this.storeLastMeteo = function (meteo) {
            $window.localStorage['saintfoyapp_meteo'] = JSON.stringify(meteo);
        };
        
        this.getVenues = function (callback) {
            callback(JSON.parse($window.localStorage['saintfoyapp_venues'] || '{}'));
        };
        this.storeVenues = function (venues) {
            $window.localStorage['saintfoyapp_venues'] = JSON.stringify(venues);
        };
        
        this.getPopupAds = function (callback) {
            callback(JSON.parse($window.localStorage['saintfoyapp_adverts'] || '{}'));
        };
        this.storePopupAds = function (adverts) {
            $window.localStorage['saintfoyapp_adverts'] = JSON.stringify(adverts);
        };
        this.getPopupIndex = function (callback) {
            callback(JSON.parse($window.localStorage['saintfoyapp_index'] || '{ \"actual\" : 0 }').actual);
        };
        this.storePopupIndex = function (index) {
            var popInd = { actual : index };
            $window.localStorage['saintfoyapp_index'] = JSON.stringify(popInd);
        };
        
        this.getAdvertCounter = function (callback) {
            callback(JSON.parse($window.localStorage['saintfoyapp_counterAds'] || '{}'));
        };
        this.storeAdvertCounter = function (counter) {
            $window.localStorage['saintfoyapp_counterAds'] = JSON.stringify(counter);
        };
        
        this.getStoredUpdates = function (callback) {
            callback(JSON.parse($window.localStorage['saintfoyapp_updates'] || _default));
        };
        this.storeUpdates = function (updates) {
            $window.localStorage['saintfoyapp_updates'] = JSON.stringify(updates);
        };
        
        this.getDeviceUser = function (callback) {
            callback(JSON.parse($window.localStorage['saintfoyapp_deviceuser'] || '{}'));
        };
        this.storeDeviceUser = function (device) {
            $window.localStorage['saintfoyapp_deviceuser'] = JSON.stringify(device);
            
            var upd = JSON.parse($window.localStorage['saintfoyapp_updates'] || _default);
            upd.device_sent = device.sent;
            $window.localStorage['saintfoyapp_updates'] = JSON.stringify(upd);
        };
        
        this.getPreference = function (callback) {
            callback(JSON.parse($window.localStorage['saintfoyapp_preference'] || _pref));
        };
        this.storePreference = function (pref) {
            $window.localStorage['saintfoyapp_preference'] = JSON.stringify(pref);
        };
        
        this.getNewsStream = function (callback) {
            //Work on a copy
            var n = JSON.parse($window.localStorage['saintfoyapp_newsflash'] || '{ \"news\" : [] }').news.concat();

            var num = Number($window.localStorage['saintfoyapp_newsIndex']);
            if (isNaN(num) || (num >= n.length)) {
                num = 0;
            }
            for (var i = 0; i < num; i++) {
                n.push(n.shift());
            }
            num++;
            $window.localStorage['saintfoyapp_newsIndex'] = num.toString();

            var f = getFilteredFlashes().sort(function (a, b) {
                return (b.creation - a.creation);
            });

            var stream = f.concat(n);

            callback(stream);
        };
        this.storeNews = function (news) {
            $window.localStorage['saintfoyapp_newsflash'] = JSON.stringify({ news : [] });

            //console.log("storeNews news.news.length " + news.news.length);
            //news.news.push({
            //    newsID : 39,
            //    title : 'news test',
            //    body : 'Ou la la la',
            //    creation : 1413840390,
            //    date_fin : 1433840390
            //});
            //news.news.push({
            //    newsID : 40,
            //    title : 'news test',
            //    body : 'wassup amigo!',
            //    creation : 1413841390,
            //    date_fin : 1433841390
            //});

            var nIndex = Number($window.localStorage['saintfoyapp_newsIndex']);
            if (isNaN(nIndex) || (nIndex > news.news.length)) {
                nIndex = 0;
            }
            $window.localStorage['saintfoyapp_newsIndex'] = nIndex.toString();
            $window.localStorage['saintfoyapp_newsflash'] = JSON.stringify(news);
        };
        
        this.getFlashes = function (callback) {
            callback(getFilteredFlashes());
        };
        this.storeFlashes = function (flashes) {
            $window.localStorage['saintfoyapp_flashes'] = JSON.stringify(flashes);
        };
        this.storeFlash = function (flash) {
            var ar = getFilteredFlashes();
            ar.unshift(flash);
            
            f = {
                flashes : ar
            };
            
            $window.localStorage['saintfoyapp_flashes'] = JSON.stringify(f);
        };
        
        var getFilteredFlashes = function () {
            var all = JSON.parse($window.localStorage['saintfoyapp_flashes'] || '{ \"flashes\" : [] }');
            var limit = parseInt(new Date().getTime() / 1000);
            //var testF = [];
            //testF.push({
            //    title : 'test1',
            //    body : 'Ou la la la',
            //    creation : 1413840390,
            //    date_fin : 1433840390
            //});
            //testF.push({
            //    title : 'test2',
            //    body : 'Whassup?',
            //    creation : 1423840668,
            //    date_fin : 1433841122
            //});
            //testF.push({
            //    title : 'test3',
            //    body : 'Zyva toto',
            //    creation : 1413840390,
            //    date_fin : 1423840668
            //});

            //return testF.filter(function (f) { return f.date_fin >= limit });
            return all.flashes.filter(function (f) { return f.date_fin >= limit });
        };

    }]);