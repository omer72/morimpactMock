Meteor.startup(function () {
    var initializing = true;
    var activeGoals = {};
    var activeGoalsId = 0;
    var goalsCalcData = {};
    var employeesPerGroup = {};
    var groupsId = [];
    var twoStars = 85;
    var oneStar = 70;
    var leadPosition = 3;
    var dayNumber=0;
    var weekNumber=0;
    var monthNumber=0;

    UsersRecords.find().observe({
        added: function (doc) {
            if (employeesPerGroup[doc.groupId] == undefined) {
                employeesPerGroup[doc.groupId] = [];
            }
            employeesPerGroup[doc.groupId].push(doc.clientSystemId);
        }

    });
    groupsId = Object.keys(employeesPerGroup);
    Goals.find().observe({
        added: function (doc) {
            if (moment().isBefore(doc.endDate)) {
                //console.log("Active Goals ",doc);
                activeGoals[doc.goalId] = doc;
            }
            ;
        },
        changed: function (newDocument, oldDocument) {
            if (moment().isBefore(newDocument.endDate)) {
                //console.log("Active Goals ", newDocument);
                for (var i = 0; i < Object.keys(activeGoals).length; i++) {
                    if (activeGoals[Object.keys(activeGoals)[i]]._id == oldDocument._id) {
                        activeGoals[Object.keys(activeGoals)] = newDocument;
                        return;
                    }
                }
            }
        },
        removed: function (oldDocument) {
            for (var i = 0; i < Object.keys(activeGoals).length; i++) {
                if (activeGoals[Object.keys(activeGoals)[i]]._id == oldDocument._id) {
                    delete activeGoals[Object.keys(activeGoals)];
                    return;
                }
            }
        }

    });
    FilterData.find({handled: false}).observeChanges({
        added: function (id, doc) {
            handleData(id,doc);
        }
    });

    function handleData(id,doc){
        if (Object.keys(activeGoals).length > 0) {
            goalsCalcData = GoalsClacData.findOne({
                clientSystemId: doc.clientSystemId,
                goalId: activeGoals[doc.goalId]._id
            });
            if (goalsCalcData == undefined) {
                goalsCalcData = {clientSystemId: doc.clientSystemId, goalId: activeGoals[doc.goalId]._id};
                goalsCalcData._id = GoalsClacData.insert(goalsCalcData);
            }
            var polite = Polite.findOne({clientSystemId: doc.clientSystemId});
            //console.log("Doc ->" ,doc);
            var totalPoints = handleNewData(doc);

            updateGoalsCalcData(totalPoints);
            totalPoints.clientSystemId = doc.clientSystemId;
            //console.log(totalPoints);
            polite.points = polite.points + totalPoints.points;
            Polite.update(polite._id, {
                $set: {points: polite.points}
            });
            updateTotal(totalPoints);
        }
        FilterData.update(id, {
            $set: {handled: true}
        })
    }


    function updateTotal(value) {
        var polite = Polite.findOne({clientSystemId: value.clientSystemId});
        var talks = Talks.findOne({clientSystemId: value.clientSystemId});
        var sales = Sales.findOne({clientSystemId: value.clientSystemId});
        var usersRecords = UsersRecords.findOne({clientSystemId: value.clientSystemId});


        usersRecords.points = talks.points + polite.points + sales.points;


        if (value.tags.length > 0) {
            if (usersRecords.tags == undefined)
                usersRecords.tags = value.tags;
            else
                usersRecords.tags = _.union(usersRecords.tags, value.tags);
            if (goalsCalcData.tags == undefined)
                goalsCalcData.tags = value.tags;
            else
                goalsCalcData.tags = _.union(goalsCalcData.tags, value.tags);
        }


        if (value.texts.length > 0) {
            if (usersRecords.texts == undefined)
                usersRecords.texts = value.texts;
            else
                usersRecords.texts = _.union(usersRecords.texts, value.texts);
            if (goalsCalcData.texts == undefined)
                goalsCalcData.texts = value.texts;
            else
                goalsCalcData.texts = _.union(goalsCalcData.texts, value.texts);
        }
        updateUserPref(usersRecords);
        UsersRecords.update(usersRecords._id, {
            $set: {points: usersRecords.points, tags: usersRecords.tags, texts: usersRecords.texts}
        });
        //console.log("goalsCalcData => ", goalsCalcData);
        GoalsClacData.update(goalsCalcData._id, {
            $set: goalsCalcData
        });


    }

    function updateUserPref(usersRecords) {
        var userPref = UserPref.findOne({clientSystemId: usersRecords.clientSystemId});
        var robotId = 1;

        if (usersRecords.points > 2000 && usersRecords.points <= 3000)
            robotId = 2;
        else if (usersRecords.points > 3000 && usersRecords.points <= 4000)
            robotId = 3;
        else if (usersRecords.points > 4000 && usersRecords.points <= 5000)
            robotId = 4;
        else if (usersRecords.points > 5000 && usersRecords.points <= 6000)
            robotId = 5;
        else if (usersRecords.points > 6000 && usersRecords.points <= 8000)
            robotId = 6;
        else if (usersRecords.points > 8000 && usersRecords.points <= 10000)
            robotId = 7;
        else if (usersRecords.points > 10000 && usersRecords.points <= 13000)
            robotId = 8;
        else if (usersRecords.points > 13000)
            robotId = 9;
        console.log("userPref._id ",robotId);
        userPref.robotPicName = '110' + robotId;
        UserPref.update(userPref._id, {
            $set: {robotPicName: userPref.robotPicName}
        });
    }

    function processEndOfGoal(goal){

        var previousGoal = Goals.findOne({
            $and: [
                {goalId: goal.goalId},
                {endData: {$lt: goal.endData}}
            ]},{sort:{endData:-1}})

        var goalsClacData = GoalsClacData.find({goalId : goal.id}).fetch();
        for (var i = 0; i <goalsClacData.length ; i++) {
            if (goalsClacData[i].bonusPointsForExellence == undefined) {
                goalsClacData[i].bonusPointsForExellence = 0;
            }

            //calculate stars

            if (goalsClacData[i].totalPoints > goal.targetAwaredPoints) {
                goalsClacData.stars = 3;
            } else if (goalsClacData[i].totalPoints > (goal.targetAwaredPoints * twoStars / 100)) {
                goalsClacData.stars = 2;
            } else if (goalsClacData[i].totalPoints > (goal.targetAwaredPoints * oneStar / 100)) {
                goalsClacData.stars = 1;
            } else {
                goalsClacData.stars = 0;
            }

            // More then the target awards

            if (goalsClacData[i].totalPoints >= (goal.targetAwaredPoints * (100 + goal.targetAwaredAbovePoints) / 100 )) {
                goalsClacData[i].totalPoints += goal.epoint.points;
                goalsClacData[i].bonusPointsForExellence += goal.epoint.points;
                if (goal.epoint.tag != undefined) goalsClacData[i].tags.push(goal.epoint.tag);
                if (goal.epoint.text != undefined) goalsClacData[i].texts.push(goal.epoint.text);
            }

            // Lead calc $scope.goal.timeLength
            var lead = Math.floor(goal.timeLength * 0.7);
            if (goalsClacData[i].numOfLead >= lead) {
                goalsClacData[i].totalPoints += goal.lead.points;
                goalsClacData[i].bonusPointsForLeading += goal.lead.points;
                if (goal.lead.tag != undefined) goalsClacData[i].tags.push(goal.lead.tag);
                if (goal.lead.text != undefined) goalsClacData[i].texts.push(goal.lead.text);
            }

            // Compute improvement indicator
            goalsClacData[i].improvementIndicator = Math.floor(goalsClacData[i].totalPoints / goal.timeLength);
            var previousGoalsClacData = GoalsClacData.findOne({
                $and: [
                    {goalId: previousGoal.id},
                    {clientSystemId: goalsClacData[i].clientSystemId}
                ]
            });

            if (previousGoalsClacData.improvementIndicator != undefined &&
                goalsClacData[i].improvementIndicator > (previousGoalsClacData.improvementIndicator * (100 + goal.improvPrecent) / 100)) {
                goalsClacData[i].totalPoints += goal.improv.points;
                goalsClacData[i].bonusPointsForImproment += goal.improv.points;
                if (goal.improv.tag != undefined) goalsClacData[i].tags.push(goal.improv.tag);
                if (goal.improv.text != undefined) goalsClacData[i].texts.push(goal.improv.text);
            }

            GoalsClacData.update(goalsClacData[i]._id, {
                $set: goalsClacData[i]
            });

            // TODO: update total points

        }

    }
    initializing = false;

    var jobEveryDay = new Cron(function () {
        console.log("%^%^%^%^^ calculateLead");
        //validate if the job is still active
        var today = new Date();
        dayNumber = dayOfTheYear(today);
        weekNumber = getWeek(today);
        monthNumber = today.getMonth(today) + 1;

        for (var i = 0; i < Object.keys(activeGoals).length; i++) {
            if (activeGoals[Object.keys(activeGoals)[i]].endDate < today) {
                delete activeGoals[Object.keys(activeGoals)[i]];
                processEndOfGoal(activeGoals[Object.keys(activeGoals)[i]]);
            }
        }
        // update daily position table

        endOfDayProcess();

        //Handle weekley cycle
        if (today.getDay() == 0){
            endOfWeekProcess();
        }

        if (today.getDate() == 1){
            endOfMonthProcess();
        }
        //if (activeGoals[0].refreshCycle == "day"){
        //
        //}else if (activeGoals[0].refreshCycle == "week"){
        //    if (today.getDay() == 0){
        //
        //    }
        //}else if (activeGoals[0].refreshCycle == "month"){
        //    if (today.getDate() == 1){
        //
        //    }
        //}
    }, {hour:24});

    function endOfDayProcess(){
        for (var j = 0; j < Object.keys(activeGoals).length; j++) {
            for (var i = 0; i < groupsId.length; i++) {
                var groupName = groupsId[i];
                //console.log(employeesPerGroup[groupName]);
                var goalsCalcDataPerGroup = GoalsClacData.find({
                    $and: [
                        {goalId: activeGoals[Object.keys(activeGoals)[j]]._id},
                        {clientSystemId: {$in: employeesPerGroup[groupName]}}
                    ]
                }).fetch();
                //console.log(goalsCalcDataPerGroup);
                var clients = [];
                for (var z = 0; z < goalsCalcDataPerGroup.length; z++) {
                    var c = {};
                    c.clientSystemId = goalsCalcDataPerGroup[z].clientSystemId;
                    c.dailyPoints = goalsCalcDataPerGroup[z].dailyPoints[dayNumber];
                    clients.push(c);
                    //console.log(goalsCalcDataPerGroup[z] + " "+c);

                }
                clients = clients.sort(dynamicSort('dailyPoints'));
                var position = 1;
                for (var z = clients.length; z > 0; z--) {

                    var client = goalsCalcDataPerGroup.filter(function (obj) {
                        return obj.clientSystemId == clients[z-1].clientSystemId;
                    })

                    if (client[0].dailyPosition == undefined) {
                        client[0].dailyPosition = {};
                    }
                    if (client[0].numOfLead == undefined) {
                        client[0].numOfLead = 0;
                    }
                    if (activeGoals[Object.keys(activeGoals)[j]].refreshCycle == "day" && position <= leadPosition){
                        client[0].numOfLead += 1;
                    }
                    client[0].dailyPosition[dayNumber] = position;
                    console.log(" client -> ", client[0]._id , position);

                    GoalsClacData.update(client[0]._id, {
                        $set: client[0]
                    });
                    position++;
                }
            }
        }
    }
    function endOfWeekProcess(){
        for (var j = 0; j < Object.keys(activeGoals).length; j++) {
            for (var i = 0; i < groupsId.length; i++) {
                var groupName = groupsId[i];
                //console.log(employeesPerGroup[groupName]);
                var goalsCalcDataPerGroup = GoalsClacData.find({
                    $and: [
                        {goalId: activeGoals[Object.keys(activeGoals)[j]]._id},
                        {clientSystemId: {$in: employeesPerGroup[groupName]}}
                    ]
                }).fetch();
                //console.log(goalsCalcDataPerGroup);
                var clients = [];
                for (var z = 0; z < goalsCalcDataPerGroup.length; z++) {
                    var c = {};
                    c.clientSystemId = goalsCalcDataPerGroup[z].clientSystemId;
                    c.weeklyPoints = goalsCalcDataPerGroup[z].weeklyPoints[dayNumber];
                    clients.push(c);
                    //console.log(goalsCalcDataPerGroup[z] + " "+c);

                }
                clients = clients.sort(dynamicSort('weeklyPoints'));
                var position = 1;
                for (var z = clients.length; z > 0; z--) {

                    var client = goalsCalcDataPerGroup.filter(function (obj) {
                        return obj.clientSystemId == clients[z-1].clientSystemId;
                    })

                    if (client[0].weeklyPosition == undefined) {
                        client[0].weeklyPosition = {};
                    }
                    if (activeGoals[Object.keys(activeGoals)[j]].refreshCycle == "week" && position <= leadPosition){
                        client[0].numOfLead += 1;
                    }
                    client[0].weeklyPosition[dayNumber] = position;
                    console.log(" client -> ", client[0]._id , position);

                    GoalsClacData.update(client[0]._id, {
                        $set: client[0]
                    });
                    position++;
                }
            }
        }
    }
    function endOfMonthProcess(){
        for (var j = 0; j < Object.keys(activeGoals).length; j++) {
            for (var i = 0; i < groupsId.length; i++) {
                var groupName = groupsId[i];
                //console.log(employeesPerGroup[groupName]);
                var goalsCalcDataPerGroup = GoalsClacData.find({
                    $and: [
                        {goalId: activeGoals[Object.keys(activeGoals)[j]]._id},
                        {clientSystemId: {$in: employeesPerGroup[groupName]}}
                    ]
                }).fetch();
                //console.log(goalsCalcDataPerGroup);
                var clients = [];
                for (var z = 0; z < goalsCalcDataPerGroup.length; z++) {
                    var c = {};
                    c.clientSystemId = goalsCalcDataPerGroup[z].clientSystemId;
                    c.monthlyPoints = goalsCalcDataPerGroup[z].monthlyPoints[dayNumber];
                    clients.push(c);
                    //console.log(goalsCalcDataPerGroup[z] + " "+c);

                }
                clients = clients.sort(dynamicSort('monthlyPoints'));
                var position = 1;
                for (var z = clients.length; z > 0; z--) {

                    var client = goalsCalcDataPerGroup.filter(function (obj) {
                        return obj.clientSystemId == clients[z-1].clientSystemId;
                    })

                    if (client[0].monthlyPosition == undefined) {
                        client[0].monthlyPosition = {};
                    }
                    if (activeGoals[Object.keys(activeGoals)[j]].refreshCycle == "month" && position <= leadPosition){
                        client[0].numOfLead += 1;
                    }
                    client[0].monthlyPosition[dayNumber] = position;
                    console.log(" client -> ", client[0]._id , position);

                    GoalsClacData.update(client[0]._id, {
                        $set: client[0]
                    });
                    position++;
                }
            }
        }
    }
    var previousId = 0;

    function dynamicSort(property) {
        var sortOrder = 1;
        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a, b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }

    console.log("jobEveryDay  " + jobEveryDay);

    function handleNewData(value) {
        var total = {points: 0, tags: [], texts: [], createdAt: value.createdAt, goalId: value.goalId};
        if (previousId != value.id) {
            //console.log("filterDataCursor added: ", value);
            previousId = value.id;
            if (value.Q1 != undefined)
                total = calcTotal(value.Q1, total);
            if (value.Q2 != undefined)
                total = calcTotal(value.Q2, total);
            if (value.Q3 != undefined)
                total = calcTotal(value.Q3, total);
            if (value.Q4 != undefined)
                total = calcTotal(value.Q4, total);
            if (value.Q5 != undefined)
                total = calcTotal(value.Q5, total);
            if (value.Q6 != undefined)
                total = calcTotal(value.Q6, total);
            if (value.Q7 != undefined)
                total = calcTotal(value.Q7, total);
            if (value.Q8 != undefined)
                total = calcTotal(value.Q8, total);
            if (value.Q9 != undefined)
                total = calcTotal(value.Q9, total);
        }
        return total;


    }


    function calcTotal(value, total) {
        //console.log("before total",total);
        // First calc the points according to to the rank and question results
        if (value > activeGoals[total.goalId].points_rank) {
            total.points += activeGoals[total.goalId].points_points;
        }

        // Sec, calc the points according to the excellence table
        for (var i = 0; i < activeGoals[total.goalId].ranges.length; i++) {
            var range = activeGoals[total.goalId].ranges[i];
            if (value >= range.from && value < range.to) {
                total.points += range.points;
                if (range.tag != undefined) {
                    total.tags.push(range.tag);
                }
                if (range.text != undefined) {
                    total.texts.push(range.text);
                }
            }
        }
        ;
        return total;
    }

    function updateGoalsCalcData(total) {
        // Add the results to the correct column according to the refresh cycle and the cycle
        var today = new Date(Date.parse(total.createdAt));
        //console.log(" before goalsCalcData ",goalsCalcData , total.points);
        if (goalsCalcData.dailyPoints == undefined) {
            initGoalsCalcData();
        }
        if (goalsCalcData.dailyPoints[dayOfTheYear(today)] == undefined) {
            goalsCalcData.dailyPoints[dayOfTheYear(today)] = 0;
        }
        goalsCalcData.dailyPoints[dayOfTheYear(today)] += total.points;

        if (goalsCalcData.weeklyPoints[getWeek(today)] == undefined) {
            goalsCalcData.weeklyPoints[getWeek(today)] = 0;
        }
        goalsCalcData.weeklyPoints[getWeek(today)] += total.points;

        if (goalsCalcData.monthlyPoints[today.getMonth(today) + 1] == undefined) {
            goalsCalcData.monthlyPoints[today.getMonth(today) + 1] = 0;
        }
        goalsCalcData.monthlyPoints[today.getMonth(total) + 1] += total.points;

        goalsCalcData.totalPoints += total.points;
        console.log("after goalsCalcData ", goalsCalcData, total.points);
    }

    function initGoalsCalcData() {
        goalsCalcData.dailyPoints = {};
        goalsCalcData.monthlyPoints = {};
        goalsCalcData.weeklyPoints = {};
        goalsCalcData.totalPoints = 0;
    }

    function dayOfTheYear(now) {
        var start = new Date(now.getFullYear(), 0, 0);
        var diff = now - start;
        var oneDay = 1000 * 60 * 60 * 24;
        var day = Math.floor(diff / oneDay);
        return day;
    }

    function getWeek(now) {
        var onejan = new Date(now.getFullYear(), 0, 1);
        return Math.ceil((((now - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    }

    function calcCycleIndex(goal) {
        if (goal.refreshCycle == "day") {
            var startDate = goal.startDate;
            var today = new Date();
            var cycleCalc = 0;
            while (startDate <= today) {
                cycleCalc++;
                startDate.setDate(startDate.getDate() + 1);
            }
            return cycleCalc;
        }
        else if (goal.refreshCycle == "week") {
            var startDate = goal.startDate;
            var today = new Date();
            var firstCycle = true;
            var cycleCalc = 1;
            while (startDate <= today) {
                var weekDay = startDate.getDay();
                if (!firstCycle && weekDay == 0)
                    cycleCalc++;

                firstCycle = false;
                startDate.setDate(startDate.getDate() + 1);
            }
            return cycleCalc;
        }
        else if (goal.refreshCycle == "month") {
            var startDate = goal.startDate;
            var today = new Date();
            var firstCycle = true;
            var cycleCalc = 1;
            while (startDate <= today) {
                var monthDay = startDate.getDate();
                if (!firstCycle && monthDay == 1)
                    cycleCalc++;
                firstCycle = false;
                startDate.setDate(startDate.getDate() + 1);
            }
            return cycleCalc;
        }
    }

    Meteor.methods({


    })

})



