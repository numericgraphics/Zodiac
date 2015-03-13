angular.module('zodiac.dir.showcase', [])
.directive('showcase', ['Events', '$ionicGesture', function (Events, $ionicGesture) {
        
        function link(scope, element, attrs) {
            
            scope.list = [];
            scope.selected = 1;

            scope.imgHeight = 575;
            scope.imgWidth = 1024;

            var currentTween = undefined;
            var anim = { value: 1 };
            var mayGesture = true;
            
            var deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
            // Full screen is 360°
            var swipeStep = deviceWidth / scope.rangeMax;

            function onswipe(e) {
                if (!mayGesture) {
                    stopmove();
                }
                console.log('deltaX :', e.gesture.deltaX);
                mayGesture = false;
                var movement = -float2int(e.gesture.deltaX / swipeStep);
                //var time = 2.5 - (1 / float2int(e.gesture.velocityX));
                var time = 2 - (movement / scope.rangeMax)
                //console.log('velocityX :', e.gesture.velocityX, time);
                anim.ref = scope.selected;
                anim.value = 1;
                currentTween = TweenLite.to(anim, time, { value: movement, onUpdate: swipePics, onComplete: endGesture });
            }
            function endGesture() {
                mayGesture = true;
            }
            function endFullturn() {
                mayGesture = true;
                scope.selected = 1;
                scope.$apply();
            }
            function fullturn() {
                stopmove();
                mayGesture = false;
                    
                anim.ref = scope.selected;
                var target = (scope.rangeMax - anim.ref);
                var time = 2 - (target / scope.rangeMax);
                anim.value = 1;
                currentTween = TweenLite.to(anim, time, { value: target, onUpdate: swipePics, onComplete: endFullturn });
            }
            function stopmove() {
                if (angular.isDefined(currentTween)) {
                    currentTween.kill();
                    currentTween = undefined;
                }
                mayGesture = true;
            }

            for (var i = scope.rangeMin; i <= scope.rangeMax; i++) {
                scope.list.push({ name : 'half/' + i.toString() + '.jpg', id : i });
            }
            
            function float2int(value) {
                return value | 0;
            };
            function swipePics() {
                
                var t = anim.ref + float2int(anim.value);
                if (t > scope.rangeMax) {
                    anim.ref -= scope.rangeMax;
                    t = scope.rangeMin;
                }
                if (t < scope.rangeMin) {
                    anim.ref += scope.rangeMax;
                    t = scope.rangeMax;
                }
                //console.log('t : ', t);
                if(scope.selected != t) scope.$apply(scope.selected = t);
            };
            
            $ionicGesture.on('swiperight', onswipe, element);
            $ionicGesture.on('swipeleft', onswipe, element);
            $ionicGesture.on('doubletap', fullturn, element);

            Events.listenEvent(scope, Events.ON_RESUME_APP, function (evt) {
                console.log('showcase resume');
                stopmove();
                scope.selected = 1
            });
        };

        return {
            restrict: 'E',
            link: link,
            scope: {
                rangeMin: '=min', 
                rangeMax: '=max'
            },
            templateUrl: 'js/directives/showcase/showcase.html'
        };
    }]);