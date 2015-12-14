Meteor.publish("userPref", function () {
  return UserPref.find({});
});