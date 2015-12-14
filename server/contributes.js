Meteor.publish("contributes", function () {
  return Contributes.find({});
});