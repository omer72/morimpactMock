Sales = new Mongo.Collection("sales");

Sales.allow({
    insert: function (userId, sales) {
        return userId && sales.userId === userId;
    },
    update: function (userId, sales, fields, modifier) {
        if (userId !== sales.userId)
            return false;

        return true;
    },
    remove: function (userId, sales) {
        if (userId !== party.owner)
            return false;

        return true;
    }
});