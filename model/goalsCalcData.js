GoalsClacData = new Mongo.Collection("goalsCalcData");

GoalsClacData.allow({
    insert: function (userId, goals) {
        return true;
    },
    update: function (userId, userPref, fields, modifier) {
        return true;
    },
    remove: function (userId, userPref) {
        if (userId !== userPref.clientSystemId)
            return false;

        return true;
    }
});