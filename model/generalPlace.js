GeneralPlace = new Mongo.Collection("general_place");

GeneralPlace.allow({
    insert: function (userId, generapPlace) {
        return userId && generapPlace.userId === userId;
    },
    update: function (userId, generapPlace, fields, modifier) {
        if (userId !== generapPlace.userId)
            return false;

        return true;
    },
    remove: function (userId, generapPlace) {
        if (userId !== party.owner)
            return false;

        return true;
    }
});