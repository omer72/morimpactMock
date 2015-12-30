


Meteor.startup(function () {
    var initializing = true;
    var activeGoals = [];
    var activeGoalsId = 0;
    var goalsCalcData = {};
    var employeesPerGroup = {};

    UsersRecords.find().observe({
        added: function (doc) {
            if (employeesPerGroup[doc.groupId] == undefined) {
                employeesPerGroup[doc.groupId] = [];
            }
            employeesPerGroup[doc.groupId].push(doc.clientSystemId);
        }

    });
    Goals.find().observe({
        added:function (doc) {
            if (moment().isBefore(doc.endDate)){
                //console.log("Active Goals ",doc);
                activeGoals.push(doc);
            };
        },
        changed :function (newDocument, oldDocument) {
            if (moment().isBefore(newDocument.endDate)) {
                //console.log("Active Goals ", newDocument);
                for (var i = 0; i < activeGoals.length; i++){
                    if(activeGoals[i]._id == oldDocument._id){
                        activeGoals[i] = newDocument;
                        return;
                    }
                }
            }
        },
        removed : function (oldDocument){
            for (var i = 0; i < activeGoals.length; i++){
                if(activeGoals[i]._id == oldDocument._id){
                    activeGoals.splice(i,1);
                    return;
                }
            }
        }

    });
    FilterData.find().observeChanges({
        added: function (id,doc) {
            if (!initializing) {
                goalsCalcData = GoalsClacData.findOne({clientSystemId:doc.clientSystemId,goalId : doc.goalId});
                if (goalsCalcData == undefined){
                    goalsCalcData = {clientSystemId:doc.clientSystemId,goalId : doc.goalId};
                    goalsCalcData._id = GoalsClacData.insert(goalsCalcData);
                }



                var polite = Polite.findOne({clientSystemId:doc.clientSystemId});
                //console.log("Doc ->" ,doc);
                var totalPoints = handleNewData(doc);

                updateGoalsCalcData(totalPoints);
                totalPoints.clientSystemId = doc.clientSystemId;
                //console.log(totalPoints);
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


        usersRecords.points = talks.points  + polite.points + sales.points;


        if ( value.tags.length >0){
            if (usersRecords.tags == undefined)
                usersRecords.tags = value.tags;
            else
                usersRecords.tags = _.union(usersRecords.tags,value.tags);
            if (goalsCalcData.tags == undefined)
                goalsCalcData.tags = value.tags;
            else
                goalsCalcData.tags = _.union(goalsCalcData.tags,value.tags);
        }


        if ( value.texts.length>0) {
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
        UsersRecords.update(usersRecords._id,{
            $set: {points:  usersRecords.points,tags : usersRecords.tags, texts : usersRecords.texts}
        });
        console.log("goalsCalcData => ",goalsCalcData);
        GoalsClacData.update(goalsCalcData._id,{
            $set:goalsCalcData
        });


    }

    function updateUserPref(usersRecords){
        var userPref = UserPref.findOne({clientSystemId:usersRecords.clientSystemId});
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
    }
    initializing = false;

    var jobEveryDay = new Cron(function(){
        console.log("%^%^%^%^^ calculateLead");
        //validate if the job is still active
        var today = new Date();
        for (var i = 0; i < activeGoals.length; i++){
            if (activeGoals[i].endDate < today){
                activeGoals[i].splice(i,1);
            }
        }

        if (activeGoals[0].refreshCycle == "day"){

        }else if (activeGoals[0].refreshCycle == "week"){
            if (today.getDay() == 0){

            }
        }else if (activeGoals[0].refreshCycle == "month"){
            if (today.getDate() == 1){

            }
        }
    },{});
    var previousId = 0;


    console.log("jobEveryDay  "+jobEveryDay);

    function handleNewData(value){
        var total = {points:0,tags:[],texts:[],createdAt:value.createdAt};
        if (previousId != value.id){
            //console.log("filterDataCursor added: ", value);
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
        //console.log("before total",total);
        // First calc the points according to to the rank and question results
        if (value > activeGoals[0].points_rank){
            total.points += activeGoals[0].points_points;
        }

        // Sec, calc the points according to the excellence table
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

    function updateGoalsCalcData(total){
        // Add the results to the correct column according to the refresh cycle and the cycle
        var today = new Date(Date.parse(total.createdAt));
        console.log(" before goalsCalcData ",goalsCalcData , total.points);
        if (goalsCalcData.dailyPoints == undefined) {
            initGoalsCalcData();
        }
        if (goalsCalcData.dailyPoints[dayOfTheYear(today)] == undefined) {
            goalsCalcData.dailyPoints[dayOfTheYear(today)] = 0;
        }
        goalsCalcData.dailyPoints[dayOfTheYear(today)] +=  total.points;

        if (goalsCalcData.weeklyPoints[getWeek(today)] == undefined) {
            goalsCalcData.weeklyPoints[getWeek(today)] = 0;
        }
        goalsCalcData.weeklyPoints[getWeek(today)]  +=   total.points;

        if (goalsCalcData.monthlyPoints[today.getMonth(today)+1] == undefined) {
            goalsCalcData.monthlyPoints[today.getMonth(today)+1] = 0;
        }
        goalsCalcData.monthlyPoints[today.getMonth(total)+1] +=   total.points;

        goalsCalcData.totalPoints += total.points;
        console.log("after goalsCalcData ",goalsCalcData , total.points);
    }

    function initGoalsCalcData() {
        goalsCalcData.dailyPoints = {};
        goalsCalcData.monthlyPoints = {};
        goalsCalcData.weeklyPoints = {};
        goalsCalcData.totalPoints = 0;
    }

    function dayOfTheYear(now){
        var start = new Date(now.getFullYear(), 0, 0);
        var diff = now - start;
        var oneDay = 1000 * 60 * 60 * 24;
        var day = Math.floor(diff / oneDay);
        return day;
    }

    function getWeek(now) {
        var onejan = new Date(now.getFullYear(),0,1);
        return Math.ceil((((now - onejan) / 86400000) + onejan.getDay()+1)/7);
    }

    function calcCycleIndex(goal){
        if (goal.refreshCycle == "day"){
            var startDate = goal.startDate;
            var today = new Date();
            var cycleCalc = 0;
            while (startDate <= today)  {
                cycleCalc ++;
                startDate.setDate(startDate.getDate()+1);
            }
            return cycleCalc;
        }
        else if (goal.refreshCycle == "week"){
            var startDate = goal.startDate;
            var today = new Date();
            var firstCycle = true;
            var cycleCalc = 1;
            while (startDate <= today)  {
                var weekDay = startDate.getDay();
                if (!firstCycle && weekDay == 0)
                    cycleCalc++;

                firstCycle = false;
                startDate.setDate(startDate.getDate()+1);
            }
            return cycleCalc;
        }
        else if (goal.refreshCycle == "month"){
            var startDate = goal.startDate;
            var today = new Date();
            var firstCycle = true;
            var cycleCalc = 1;
            while (startDate <= today)  {
                var monthDay = startDate.getDate();
                if (!firstCycle && monthDay == 1)
                    cycleCalc++;
                firstCycle = false;
                startDate.setDate(startDate.getDate()+1);
            }
            return cycleCalc;
        }
    }

});



