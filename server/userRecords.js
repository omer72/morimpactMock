Meteor.publish("usersRecords", function () {
  return UsersRecords.find({});
});