Polite = new Mongo.Collection("polite");

Polite.allow({
    insert: function (userId, polite) {
        return true;
    },
    update: function (userId, polite, fields, modifier) {
        return true;
    },
    remove: function (userId, polite) {
        if (userId !== party.owner)
            return false;

        return true;
    }
});