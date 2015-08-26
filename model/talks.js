Talks = new Mongo.Collection("talks");

Talks.allow({
    insert: function (userId, talks) {
        return userId && talks.userId === userId;
    },
    update: function (userId, talks, fields, modifier) {
        if (userId !== talks.userId)
            return false;

        return true;
    },
    remove: function (userId, talks) {
        if (userId !== party.owner)
            return false;

        return true;
    }
});