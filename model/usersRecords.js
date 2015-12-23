UsersRecords = new Mongo.Collection("usersRecords");

UsersRecords.allow({
    insert: function (userId, usersRecords) {
        return true;
    },
    update: function (userId, usersRecords, fields, modifier) {
        return true;
    },
    remove: function (userId, usersRecords) {
        if (userId !== usersRecords.clientSystemId)
            return false;

        return true;
    }
});