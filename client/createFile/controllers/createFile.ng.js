angular.module("morimpact").controller("createFileCtrl", function ($scope, $meteor) {

    $scope.questions = ["Q1","Q2","Q3","Q4","Q5","Q6","Q7","Q8","Q9"];
    $scope.question = [];
  $scope.saveFile = function(){
      console.log("save File");
      var filename = 'data.json';

      var data = { "config": [{}]};

      for (var i = 0 ; i<$scope.question.length ; i++){
          if ($scope.question[i] != undefined){
              data.config[0]["Q"+(1+i)] =  parseInt($scope.question[i].answer);
          }
      }
      if (typeof data === 'object') {
          data = JSON.stringify(data, undefined, 2);
      }

      var blob = new Blob([data], {type: 'text/json'}),
          e = document.createEvent('MouseEvents'),
          a = document.createElement('a');

      a.download = filename;
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
      e.initMouseEvent('click', true, false, window,
          0, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);

  }
});