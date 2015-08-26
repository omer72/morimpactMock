Meteor.startup(function () {
  if (Groups.find().count() === 0) {
    var groups = [
      {'name': 'Default',
        'description': 'Default Group'}
    ];
    for (var i = 0; i < groups.length; i++)
      Groups.insert({name: groups[i].name, description: groups[i].description});
  }
});