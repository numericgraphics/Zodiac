angular.module('zodiac.dir.showcase', [])
.directive('showcase', ['Events', '$ionicGesture', function (Events, $ionicGesture) {
        
        var seats;
        
        function link(scope, element, attrs) {
            
            seats = $('.seat').ThreeSixty({
                totalFrames: 200, // Total no. of image you have for 360 slider
                endFrame: 200, // end frame for the auto spin animation
                currentFrame: 1, // This the start frame for auto spin
                imgList: '.threesixty_images', // selector for image list
                progress: '.spinner', // selector to show the loading progress
                imagePath: 'img/360/full/', // path of the image assets
                ext: '.jpg', // extention for the assets
                height: 540,
                width: 480,
                navigation: true,
                disableSpin: true // Default false
            });
            
            var isplaying = false;
            function togglePlay(e) {
                if (isplaying) {
                    seats.stop();
                } else {
                    seats.play();
                }
                isplaying = !isplaying;
            }

            $ionicGesture.on('doubletap', togglePlay, element);

            Events.listenEvent(scope, Events.ON_RESUME_APP, function (evt) {
                seats.stop();
                seats.gotoAndPlay(1);
            });
        };
        
        return {
            restrict: 'E',
            link: link,
            scope: {
                
            },
            templateUrl: 'js/directives/showcase/slider360.html'
        };
    }]);