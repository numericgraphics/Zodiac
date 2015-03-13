//factory for processing push notifications.
angular.module('geolocation', [])


   .factory('GeoLocationService', function () {
    
    var positionGPS = {};
    
    function onDeviceReady() {
        console.info('GeoLocationService  Device is ready.');
        //register with google GCM server
        //var pushNotification = window.plugins.pushNotification;
        //pushNotification.register(gcmSuccessHandler, gcmErrorHandler, {"senderID":"738721411656","ecb":"window.onNotificationGCM "});
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
    // ALL GCM notifications come through here. 
    window.onSuccess = function (position) {
        // alert('GeoLocationService onSuccess' + position );
        //console.log('GeoLocationService onSuccess' + position + '');
        positionGPS.lat = position.coords.latitude;
        positionGPS.long = position.coords.longitude;
            
    }
    window.onError = function (e) {
        console.log('GeoLocationService onError' + e.event + '');
            
    }
    
    
    return {
        initialize : function () {
            console.info('GeoLocationService  initializing');
            //document.addEventListener('deviceready', onDeviceReady, false);
            onDeviceReady();
                
        },
        
        getPosition : function (cb) {
            //alert("getPosition");
            if (cb) {
                navigator.geolocation.getCurrentPosition(
                    function (p) {
                        positionGPS.lat = p.coords.latitude;
                        positionGPS.long = p.coords.longitude;
                        cb(positionGPS);
                    }, 
                            function (e) {
                        console.log('GeoLocationService onError' + e.event + '');
                        cb(null);
                    }
                );
            }
            return positionGPS;
        }
    }
});
 