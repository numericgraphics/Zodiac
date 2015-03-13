//factory for processing push notifications.
angular.module('tools', [])

.factory('MeteoTranslate', function () {
    
    //function getFRValue(arr) {
    //    var l = arr.length;
    //    for (var i = 0; i < l; i++) {
    //        if (arr[i].lang == 'fr') {
    //            return arr[i].value;
    //        }
    //    }
    //    return null;
    //}

    //function getENValue(arr) {
    //    var l = arr.length;
    //    for (var i = 0; i < l; i++) {
    //        if (arr[i].lang == 'en') {
    //            return arr[i].value;
    //        }
    //    }
    //    return null;
    //}
    
    function extract(arr, first, second) {
        var l = arr.length;
        for (var i = 0; i < l; i++) {
            if (arr[i].lang == first) {
                return arr[i].value;
            }
        }
        for (var j = 0; j < l; j++) {
            if (arr[j].lang == second) {
                return arr[j].value;
            }
        }
        return '';
    }

    return {
        extractMeteo : function (bul, lang) {
            var extractFirst = 'en';
            var extractSecond = 'fr';
            if (lang == 'fr') {
                extractFirst = 'fr';
                extractSecond = 'en';
            }

            var modelMeteo = {};
            modelMeteo.date = bul.date;
            modelMeteo.comment = extract(bul.meteo.comment, extractFirst, extractSecond);
            modelMeteo.today = extract(bul.meteo.today, extractFirst, extractSecond);
            modelMeteo.tomorrow = extract(bul.meteo.lendemain, extractFirst, extractSecond);
            modelMeteo.week = extract(bul.meteo.week, extractFirst, extractSecond);

            return modelMeteo;
        }
    }
});
 