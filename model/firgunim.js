Firgunim = new Mongo.Collection("firgunim");

Firgunim.allow({
    insert: function (userId, firgunim) {
        return userId && firgunim.userId === userId;
    },
    update: function (userId, firgunim, fields, modifier) {
        if (userId !== firgunim.userId)
            return false;

        return true;
    },
    remove: function (userId, firgunim) {
        if (userId !== firgunim.owner)
            return false;

        return true;
    }
});