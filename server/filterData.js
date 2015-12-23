Meteor.publish("filterData", function () {
    return FilterData.find({},{'skip':0, 'limit':1,'sort':{'createdAt': -1}});
});