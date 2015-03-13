//factory for processing push notifications.
angular.module('networkInformation', [])


   .factory('NetworkInformationService', function($rootScope) {

       var positionGPS = {};
       var DeviceState;
       
        function onDeviceReady() {
            console.info('NetworkInformationService  Device is ready');
            window.onAppStart();
            
        }

        window.onOnline = function () {
            //alert('NetworkInformationService  onOnline');
            console.info('NetworkInformationService  onOnline' + navigator.connection.type);

            DeviceState = "DEVICE_ONLINE";
            $rootScope.onLineStatus = DeviceState;
            $rootScope.$digest();

            //$rootScope.$broadcast( "DEVICE_OFFLINE" );
            document.removeEventListener("online", onOnline, false);
            document.addEventListener("offline", onOffline, false);
        }

         window.onOffline = function () {
            //alert('NetworkInformationService  onOffline');
            console.info('NetworkInformationService  onOffline');

            DeviceState = "DEVICE_OFFLINE";
            $rootScope.onLineStatus = DeviceState;
            $rootScope.$digest();
            //$rootScope.$broadcast( "DEVICE_OFFLINE" );
            document.removeEventListener("offline", onOffline, false);
            document.addEventListener("online", onOnline, false);
        }

         window.onAppStart = function () {
             var status = navigator.connection.type;
             console.info('onAppStart', status);
             switch (status) {

                case Connection.UNKNOWN  : 
                case Connection.ETHERNET  : 
                case Connection.WIFI  :
                case Connection.CELL_2G  :
                case Connection.CELL_3G  :
                case Connection.CELL_4G  : 
                case Connection.CELL  : 
                    DeviceState = "DEVICE_ONLINE";
                    $rootScope.onLineStatus = DeviceState;
                    $rootScope.$digest();
                    //$rootScope.$broadcast( "DEVICE_ONLINE" );
                    document.addEventListener("offline", onOffline, false);
                    break;


                case Connection.NONE  :
                    DeviceState = "DEVICE_OFFLINE";
                    $rootScope.onLineStatus = DeviceState;
                    $rootScope.$digest();
                    //$rootScope.$broadcast( "DEVICE_OFFLINE" );
                    document.addEventListener("online", onOnline, false);
                    break;

                default :
                    DeviceState = "DEVICE_UNDEFINED";
                    $rootScope.onLineStatus = DeviceState;
                    $rootScope.$digest();
                    console.log('!!! NetworkInformationService DEVICE_UNDEFINED !!!');

             }
        }

        function checkConnection() {
            var networkState = navigator.connection.type;

            var states = {};
            states[Connection.UNKNOWN]  = 'Unknown connection';
            states[Connection.ETHERNET] = 'Ethernet connection';
            states[Connection.WIFI]     = 'WiFi connection';
            states[Connection.CELL_2G]  = 'Cell 2G connection';
            states[Connection.CELL_3G]  = 'Cell 3G connection';
            states[Connection.CELL_4G]  = 'Cell 4G connection';
            states[Connection.CELL]     = 'Cell generic connection';
            states[Connection.NONE]     = 'No network connection';

            alert('Connection type: ' + states[networkState]);
            return networkState;
        }
        
        return {
            initialize : function () {
                console.info('NetworkInformationService  initializing');
                //document.addEventListener('deviceready', onDeviceReady, false);
                onDeviceReady();
            },

            getState : function () {
                return DeviceState;
            }
        }
    });
 



