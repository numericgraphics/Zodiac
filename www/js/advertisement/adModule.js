angular.module('advertisement', [])
.factory('AdService', ['Data', 'AssetManagementService', function (Data, AssetManagementService) {
    
        var _adsArray = [];
        
        var initMethod = function () {
            console.log('adModule initMethod');
        };
        
        var loadNextAdvert = function (callback) {
            Data.getAdvertisement(function (ads) {
                console.log('adModule initMethod ' + JSON.stringify(ads));
                if (ads && ads.length > 0) {
                    _adsArray = ads;
                    Data.getAdIndex(function (index) {
                        var count = index + 1;
                        if (count >= _adsArray.length) {
                            count = 0;
                        }
                        
                        console.log('getAdIndex ' + count);
                        Data.storeAdIndex(count);
                        AssetManagementService.getAdvertImage(_adsArray[count].file, function (err, fileEntry) {
                            console.log('getAdvertImage ' + JSON.stringify(err));
                            if (!err) {
                                callback(null, { path : fileEntry.nativeURL, id : _adsArray[count].adID });
                            } else {
                                callback(new Error('La publicité n\'est pas disponible localement'), null);
                            }
                        });
                    });
                } else {
                    _adsArray = [];
                    callback(new Error('Aucune publicité à présenter'), null);
                }
            });
            

        };

        return {
            initialize : initMethod,
            getNextAd : loadNextAdvert
        };
}]);