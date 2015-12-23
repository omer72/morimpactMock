FilterData = new Mongo.Collection("filterData");

FilterData.allow({
    insert: function (userId, filterData) {
        return true;
    },
    update: function (userId, firgunim, fields, modifier) {
        if (userId !== firgunim.userId)
            return false;

        return true;
    },
    remove: function (userId, filterData) {
        if (userId !== filterData.owner)
            return false;

        return true;
    }
});