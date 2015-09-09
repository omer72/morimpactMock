UsersRecords = new Mongo.Collection("usersRecords");

UsersRecords.allow({
    insert: function (userId, usersRecords) {
        return userId && usersRecords.clientSystemId === userId;
    },
    update: function (userId, usersRecords, fields, modifier) {
        if (userId !== usersRecords.clientSystemId)
            return false;

        return true;
    },
    remove: function (userId, usersRecords) {
        if (userId !== usersRecords.clientSystemId)
            return false;

        return true;
    }
});