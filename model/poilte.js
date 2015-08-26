Polite = new Mongo.Collection("polite");

Polite.allow({
    insert: function (userId, polite) {
        return userId && polite.userId === userId;
    },
    update: function (userId, polite, fields, modifier) {
        if (userId !== polite.userId)
            return false;

        return true;
    },
    remove: function (userId, polite) {
        if (userId !== party.owner)
            return false;

        return true;
    }
});