angular.module('zodiac.dir.leftPanel', [])
.directive('leftpanel', ['$animate', 'Events', function ($animate, Events) {
        
        function link(scope, element, attrs) {
            var panelOpen = false;

            element.addClass('movement');
            
            var anim = { value : 0 };
            scope.openTransition = function () {
                $animate.animate(element, {}, {
                    open: true,
                    timing: 0.5,
                    x: '765px',
                    y: '0px'
                }).then(function () {
                    panelOpen = true;
                });
            }

            scope.closeTransition = function () {
                $animate.animate(element, {}, {
                    open: false,
                    timing: 0.5,
                    x: '0px',
                    y: '0px'
                }).then(function () {
                    panelOpen = false;
                });
            }

            var backButton = element[0].querySelector('#rectInside');
            
            var menuEnhanced = element[0].querySelector('#menu-enhanced');
            var menuStandard = element[0].querySelector('#menu-standard');
            var menuLight = element[0].querySelector('#menu-light');
            var menuArray = [menuEnhanced, menuStandard, menuLight];
            
            scope.openSubMenu = function (index) {
                Events.triggerEvent(Events.ZODIAC_ADD_OPTION, { indexNum: index });
                for (var i = 0; i < menuArray.length; i++) {
                    if (i == index) menuArray[i].style.opacity = 1;
                    else menuArray[i].style.opacity = 0;
                }
            }

            Events.listenEvent(scope, Events.ON_RESUME_APP, function (evt) {
                if (panelOpen) {
                    scope.closeTransition();
                }
            });
            //Events.listenEvent(scope, Events.ZODIAC_ADD_OPTION, function (evt) {
            //    if (panelOpen) {
            //        scope.closeTransition();
            //    }
            //});
        }
        
        return {
            restrict : 'A',
            link: link,
            scope: { },
            templateUrl: 'js/directives/panel/leftPanel.html'
        };

    }])
.animation(".fade", function () {
    
    return {
        
        animate: function (element, className, from, to, done) {
            console.log("animate fade");
            TweenLite.to(element, 0.5, {
                x: to.x,
                y: to.y,
                ease: Linear.ease,
                force3D: true,
                onComplete: done,
            });
        }
    };
})
.animation(".movement", function () {
    
    return {
        
        animate: function (element, className, from, to, done) {
            TweenLite.to(element, to.timing, {
                x: to.x,
                y: to.y,
                ease: Linear.ease,
                force3D: true,
                onStart : function () { console.log("movement onStart") },
                onComplete: done
            });
            
            var objAlphpa1 = element[0].querySelector('#bt-alpha-1');
            var objAlphpa2 = element[0].querySelector('#bt-alpha-2');

            var opacityValue;
            if (to.open) {
                opacityValue = 0.2;
            } else {
                opacityValue = 1;
            }
            var alph = {
                opacity: opacityValue,
                ease: Linear.ease
            };

            TweenMax.allTo([objAlphpa1, objAlphpa2], 0.5, {
                opacity: opacityValue,
                ease: Linear.ease

            });
        }

    };
})
.animation(".fadeIn", function () {
    var duration = 0.5;
    return {
        
        addClass: function (element, className) {
            console.log("fadeIn test");
            TweenLite.to(element, duration, { opacity: 1 });
            TweenLite.to(element, duration, { y: '0px' });
        }
    };
});