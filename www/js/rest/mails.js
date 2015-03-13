var rest = angular.module( 'moduleMailing', [] );

rest.service( 'Mail', ['$http', 'Base64', function ($http, Base64) {
        
        var _credentials = 'Basic ' + Base64.encode('saintefoy:services');

        this.askQuestion = function (name, mail, msg, serv, callback) {
            var envoi = {
                    nom: name,
                    origin: mail,
                    message: msg
                };

            $http.defaults.headers.common['Authorization'] = _credentials;
            $http.post(serv + 'saintefoy/api/appContact', { data : envoi })
                .success(function(retour) {
                    if(retour.success){
                        callback( true );
                    }else{
                        callback( false );
                        console.log(retour.error);
                    }
                
                });
        };

        this.askService = function (serviceName, name, mail, msg, phoneNumber, serv, callback) {
            var envoi = {
                nom: name,
                origin: mail,
                service : serviceName,
                phone : phoneNumber,
                message: msg
            };
            
            $http.defaults.headers.common['Authorization'] = _credentials;
            $http.post(serv + 'saintefoy/api/serviceContact', { data : envoi })
                .success(function (retour) {
                    if (retour.success) {
                        callback(true);
                    } else {
                        callback(false);
                        console.log(retour.error);
                    }
                
                });
        };

}]);