//factory for processing push notifications.
angular.module('pushnotification', ['moduleData'])


   .factory('PushProcessingService', ['Data', '$rootScope', function (Data, $rootScope) {
    
    var deviceID;
    
    function onDeviceReady() {
        var pushNotification = window.plugins.pushNotification;
        
        if (ionic.Platform.isAndroid() == true) {
            // console.log('isAndroid');
            pushNotification.register(gcmSuccessHandler, gcmErrorHandler, { "senderID": "738721411656", "ecb": "window.onNotificationGCM " });
        } else if (ionic.Platform.isIOS() == true || ionic.Platform.isIPad() == true) {
            //  console.log('isIOS || isIPad');
            //alert('isIOS || isIPad');
            pushNotification.register(tokenHandler, errorHandler, { "badge": "true", "sound": "true", "alert": "true", "ecb": "window.onNotificationAPN" });
        } else {
            console.info('!!! what the hell ! this is not supported !');
        }
    };
    
    
    //IOS
    window.onNotificationAPN = function (event) {
        
        if (event.alert) {
            alert(event.alert);
            if (event.alert == 'Sainte Foy Flash') {
                var tempMessage = JSON.parse(e.message);
                Data.storeFlash(tempMessage);
                $rootScope.$broadcast('flashUpdate');
            } else {
                Data.initialize();
            }
        }
    }
    function tokenHandler(result) {
        deviceID = result;
    }
    function errorHandler(error) {
           // console.error('NOTIFY  '+error);
          //  alert('NOTIFY = ' + error);
    }
    

    //ANDROID
    window.onNotificationGCM = function (e) {
        
        switch (e.event) {
            case 'registered':
                if (e.regid.length > 0) {
                    deviceID = e.regid;
                }
                break;
 
            case 'message':
                var title = e.collapse_key;
                alert(title);
                if (title == 'Sainte Foy Flash') {
                    var tempMessage = JSON.parse(e.message);
                    Data.storeFlash(tempMessage);
                    $rootScope.$broadcast('flashUpdate');
                } else {
                    Data.initialize();
                }
                break;
 
            case 'error':
                //alert('error');
                //  console.log('PushProcessingService |||| ERROR -&gt; MSG:' + e.msg + '');
                break;
 
            default:
                // alert('Unknown message' + e);
                //  console.log('PushProcessingService |||| EVENT -&gt; Unknown, an event was received and we do not know what it is');
                break;
        }
    }
    function gcmSuccessHandler(result) {
           // console.info('PushProcessingService |||| NOTIFY  pushNotification.register succeeded.  Result = '+result)
    }
    function gcmErrorHandler(error) {
           // console.error('PushProcessingService |||| NOTIFY  '+error);
    }
    
    
    return {
        initialize : function () {
            onDeviceReady();
        },
        registerID : function (id) {
            deviceID = id;
        }, 
        getRegisterID : function () {
            return deviceID;
        },
        //unregister can be called from a settings area.
        unregister : function () {
            var push = window.plugins.pushNotification;
            if (push) {
                push.unregister(function () {
                     //   console.info('unregister success')
                });
            }
        }
    };
}]);
 