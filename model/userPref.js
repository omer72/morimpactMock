UserPref = new Mongo.Collection("userPref");

UserPref.allow({
    insert: function (userId, userPref) {
        return userId && userPref.userId === userId;
    },
    update: function (userId, userPref, fields, modifier) {
        if (userId !== userPref.userId)
            return false;

        return true;
    },
    remove: function (userId, userPref) {
        if (userId !== party.owner)
            return false;

        return true;
    }
});