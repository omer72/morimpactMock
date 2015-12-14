Meteor.publish("polite", function () {
  return Polite.find({});
});