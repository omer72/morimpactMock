/**
 * Created by oetrog on 20/12/2015.
 */
angular.module("morimpact").filter("dateFilter", function() {
    return function(items) {
        var tempData = [];
        angular.forEach(items, function(value, key) {
            if (moment().isBefore(value.endDate)){
                tempData.push(value);
            };
        });

        return tempData;
    };
});