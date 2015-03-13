
angular.module('moduleSwipeCard', ['ionic', 'ionic.contrib.ui.cards'])

.directive('noScroll', function($document) {

  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {

      $document.on('touchmove', function(e) {
        e.preventDefault();
      });
    }
  }
})

.directive('rawdata', function() {
  return {
    link: function(scope, element, attr, ctrl) { 
            
            var data = (element[0].text)
            scope.jsonData = eval(data);

    }
  }
})


.controller('CardsCtrl', function($scope, $ionicSwipeCardDelegate, AssetManagementService) {
  $scope.cardTypesFromJson = "";
  $scope.cardCurrentIndex = 0;

  var assetDir = AssetManagementService.templateDirectory() + $scope.selectedShop.templateApp.name + '/assets/';

  $scope.cardTypes = $scope.jsonData;

  for (var i = 0; i < $scope.cardTypes.length; i++) {
      $scope.cardTypes[i].image = assetDir + $scope.cardTypes[i].image;
  }

  $scope.cards = Array.prototype.slice.call($scope.cardTypes, 0, 0);
  
  $scope.cardSwiped = function(index) {
      
      if($scope.cardCurrentIndex == ($scope.cardTypes.length - 1)){
          $scope.cardCurrentIndex = 0;
      }else {
          $scope.cardCurrentIndex++;
        }
    $scope.addCard();
  };

  $scope.cardDestroyed = function(index) {
    $scope.cards.splice(index, 1);
  };

  $scope.addCard = function() {
    var newCard = $scope.cardTypes[$scope.cardCurrentIndex];
    newCard.id = Math.random();
    $scope.cards.push(angular.extend({}, newCard));
  }
})

.controller('CardCtrl', function($scope, $ionicSwipeCardDelegate) {
  $scope.goAway = function() {
    var card = $ionicSwipeCardDelegate.getSwipeableCard($scope);
    card.swipe();
  };
});
