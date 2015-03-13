angular.module('zodiac.serv.events', [])
.factory('Events', ['$rootScope', function ($rootScope) {
        var _eventTypes = [];
        _eventTypes[0] = 'myAppIsReady';
        _eventTypes[1] = 'gettextLanguageChanged';
        _eventTypes[2] = '$stateChangeSuccess';
        _eventTypes[3] = 'onPauseApp';
        _eventTypes[4] = 'onResumeApp';
        _eventTypes[5] = '$ionicView.loaded';
        _eventTypes[6] = '$ionicView.enter';
        _eventTypes[7] = '$destroy';
        _eventTypes[8] = '$ionicView.leave';
        _eventTypes[9] = 'zodiac_add_options';
        
        return {
            APP_READY : 0, // args => (string)DEVICE_ONLINE or DEVICE_OFFLINE
            LANGUAGE_CHANGED : 1, // no args
            NAV_STATE_CHANGE : 2, // MUST USE $rootScope // args => toState, toParams, fromState, fromParams
            ON_PAUSE_APP : 3, // no args
            ON_RESUME_APP : 4, // no args
            VIEW_LOADED : 5, // no args
            VIEW_ENTER : 6, // no args
            VIEW_DESTROY : 7, // no args
            VIEW_LEAVE : 8, // no args // Works only in home view
            ZODIAC_ADD_OPTION : 9, // args => option { id: 0, name : '', weight : 0.0 }
            
            initialize : function () { },
            triggerEvent : function (ev, args) {
                switch (ev) {
                    case 2: 
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                        throw new Error('This event (' + ev + ') can\'t be triggered manually');
                        break;
                    default:
                        $rootScope.$broadcast(_eventTypes[ev], args);
                        break;
                }
            },
            //cb => callback function as function (event, args...)
            listenEvent : function (scope, ev, cb) {
                if (scope) {
                    switch (ev) {
                        case 2:
                            throw new Error('NAV_STATE_CHANGE must use $rootScope');
                            break;
                        default:
                            return scope.$on(_eventTypes[ev], cb);
                    }
                } else {
                    return $rootScope.$on(_eventTypes[ev], cb);
                }
            }
        }
    }]);