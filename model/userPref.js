UserPref = new Mongo.Collection("userPref");

UserPref.allow({
    insert: function (userId, userPref) {
        return userId && userPref.clientSystemId === userId;
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