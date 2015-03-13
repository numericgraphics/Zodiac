angular.module('zodiac.dir.configuration', [])
.directive('configuration', ['Events', function (Events) {
        
        function link(scope, elem, attrs) {
            
            var menuEnhanced = elem[0].querySelector('#menu-enhanced');
            var menuStandard = elem[0].querySelector('#menu-standard');
            var menuLight = elem[0].querySelector('#menu-light');
            var menuArray = [menuEnhanced, menuStandard, menuLight];
            
            Events.listenEvent('', Events.ZODIAC_ADD_OPTION, function (evt, op) {
                scope.initSubMenu(op.indexNum);
            });
            
            scope.initSubMenu = function (index) {
                for (var i = 0; i < menuArray.length; i++) {
                    if (i == index) menuArray[i].style.opacity = 1;
                    else menuArray[i].style.opacity = 0;
                }
            }

            scope.resetDemo = function () {
                for (var i = 0; i < menuArray.length; i++) {
                    if (i == 1) menuArray[i].style.opacity = 1;
                    else menuArray[i].style.opacity = 0;
                }
                Events.triggerEvent(Events.ON_RESUME_APP);
            };

        };
        
        return {
            restrict: 'E',
            link: link,
            scope: {
                
            },
            templateUrl: 'js/directives/configuration/configuration.html'
        };
    }]);