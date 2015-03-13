angular.module('starter.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('Friends', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var friends = [
    { id: 0, name: 'Scruff McGruff' },
    { id: 1, name: 'G.I. Joe' },
    { id: 2, name: 'Miss Frizzle' },
    { id: 3, name: 'Ash Ketchum' }
  ];

  return {
    all: function() {
      return friends;
    },
    get: function(friendId) {
      // Simple index lookup
      return friends[friendId];
    }
  }
})

.factory('NextHours', [function() {

  // Enregistre l'action utilisée par l'utilisateur et à quelle heure
  NextHours.giveNextHours = function() {
      
    //var result= [];
    //var now = new Date();
    //now.setHours(17);
    //now.setMinutes(41);

    //for(var i=0; i < horaires.length; i++){
    //  for(var j=0; j < horaires[i].obj.length; j++){
    //    datesArray.push(horaires[i].obj[j]);
    //  }
    //}

    //for(var k=0; k < datesArray.length; k++){
    //  var later = new Date();
    //  later.setHours(datesArray[k].hours);
    //  later.setMinutes(datesArray[k].minute)
    //  if(later >= now ){
    //   result.push(later);
    // }
    //}
   
  };

  return NextHours;
}]);
