Meteor.publish("generalPlace", function () {
  return GeneralPlace.find({});
});