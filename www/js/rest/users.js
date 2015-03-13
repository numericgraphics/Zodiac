var rest = angular.module( 'moduleUser', [] );

rest.service( 'User', ['$http', 'Base64', '$rootScope', function ($http, Base64, $rootScope) {
        var anonUser = {
            "login": 'seed',
            "passw": 'nodeproject'
        };

        var myUser = anonUser;


        this.isIdentified = function(){
            return (myUser != anonUser);
        };

        this.identity = function(){
            return myUser;
        };

        this.credentials = function(){
            return 'Basic ' + Base64.encode(myUser.login + ':' + myUser.passw);
        };

    }]);