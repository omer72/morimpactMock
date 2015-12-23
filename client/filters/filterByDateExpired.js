/**
 * Created by oetrog on 20/12/2015.
 */
angular.module("morimpact").filter("dateFilterExpired", function() {
    return function(items) {
        var tempData = [];
        angular.forEach(items, function(value, key) {
            if (moment().isAfter(value.endDate)){
                tempData.push(value);
            };
        });

        return tempData;
    };
});