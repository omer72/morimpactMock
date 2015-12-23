


Meteor.startup(function () {
    var initializing = true;
    var activeGoals = [];
    var activeGoalsId = 0;
    activeGoal = Goals.find().observe({
        added:function (doc, value) {
            if (moment().isBefore(doc.endDate)){
                console.log("Active Goals ",doc);
                activeGoals.push(doc);
            };
        }
    });
    filterDataCursor = FilterData.find().observeChanges({
        added: function (doc, value) {
            if (!initializing) {
                var polite = Polite.findOne({clientSystemId:value.clientSystemId});
                console.log("Polite ->" ,polite);
                var totalPoints = handleNewData(value);
                totalPoints.clientSystemId = value.clientSystemId;
                console.log(totalPoints);
                polite.points = polite.points  + totalPoints.points;
                Polite.update(polite._id,{
                    $set: {points:  polite.points}
                });
                updateTotal(totalPoints);
            }
        }
    });


    function updateTotal(value){
        var polite = Polite.findOne({clientSystemId:value.clientSystemId});
        var talks = Talks.findOne({clientSystemId:value.clientSystemId});
        var sales = Sales.findOne({clientSystemId:value.clientSystemId});
        var usersRecords = UsersRecords.findOne({clientSystemId:value.clientSystemId});
        var userPref = UserPref.findOne({clientSystemId:value.clientSystemId});

        usersRecords.points = talks.points  + polite.points + sales.points;
        if (usersRecords.tags == undefined){
            usersRecords.tags = [];
        }

        if (value.tags != undefined && value.tags.length >0){
            usersRecords.tags = _.union(usersRecords.tags,value.tags);
        }

        if (usersRecords.texts == undefined){
            usersRecords.texts = [];
        }

        if (value.texts != undefined && value.texts.length>0)
            usersRecords.texts  = _.union(usersRecords.texts,value.texts);

        var robotId = 1;

        if (usersRecords.points > 400 && usersRecords.points <= 800)
            robotId = 2;
        else if (usersRecords.points > 800 && usersRecords.points <= 1200)
            robotId = 3;
        else if (usersRecords.points > 1200 && usersRecords.points <= 1600)
            robotId = 4;
        else if (usersRecords.points > 1600 && usersRecords.points <= 2000)
            robotId = 5;
        else if (usersRecords.points > 2000 && usersRecords.points <= 2400)
            robotId = 6;
        else if (usersRecords.points > 2400 && usersRecords.points <= 2800)
            robotId = 7;
        else if (usersRecords.points > 2800 && usersRecords.points <= 3200)
            robotId = 8;
        else
            robotId = 9;

        userPref.robotPicName =  '110'+robotId;
        UserPref.update(userPref._id,{
            $set:{robotPicName : userPref.robotPicName }
        });
        UsersRecords.update(usersRecords._id,{
            $set: {points:  usersRecords.points,tags : usersRecords.tags, texts : usersRecords.texts}
        });

    }
    initializing = false;

    var previousId = 0;

    function handleNewData(value){
        var total = {points:0,tags:[],texts:[]};
        if (previousId != value.id){
            console.log("filterDataCursor added: ", value);
            previousId = value.id;
            if (value.Q1 != undefined)
                total = calcTotal(value.Q1,total);
            if (value.Q2 != undefined)
                total = calcTotal(value.Q2,total);
            if (value.Q3 != undefined)
                total = calcTotal(value.Q3,total);
            if (value.Q4 != undefined)
                total = calcTotal(value.Q4,total);
            if (value.Q5 != undefined)
                total = calcTotal(value.Q5,total);
            if (value.Q6 != undefined)
                total = calcTotal(value.Q6,total);
            if (value.Q7 != undefined)
                total = calcTotal(value.Q7,total);
            if (value.Q8 != undefined)
                total = calcTotal(value.Q8,total);
            if (value.Q9 != undefined)
                total = calcTotal(value.Q9,total);
        }
        return total;


    }


    function calcTotal(value,total){
        if (value > activeGoals[0].points_rank){
            total.points += activeGoals[0].points_points;
        }
        console.log(activeGoals[0].ranges.length);
        for (var i = 0; i < activeGoals[0].ranges.length; i++){
            var range = activeGoals[0].ranges[i];
                if (value >= range.from &&  value < range.to){
                    total.points +=range.points;
                    if (range.tag != undefined){
                        total.tags.push(range.tag);
                    }
                    if (range.text != undefined){
                        total.texts.push(range.text);
                    }
                }
            };
        return total;
    }
    //if (GeneralPlace.find().count() === 0) {
    //  var generalPlace = [
    //    {'userId': 1,
    //      'position': 1}
    //  ];
    //  for (var i = 0; i < generalPlace.length; i++)
    //    GeneralPlace.insert({userId: generalPlace[i].userId, position: generalPlace[i].position});
    //}
});



