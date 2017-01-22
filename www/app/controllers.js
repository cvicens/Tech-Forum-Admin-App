'use strict';

var myApp = angular.module('myApp.controllers', ['fhcloud', 'chart.js']);

myApp.controller('MainCtrl', function($scope, $q, fhcloud) {
  $scope.options = {legend: {display: true}};
  $scope.experienciaLabels = ["Excellent", "Good", "Average", "Fair", "Poor"];
  $scope.experienciaData = [];
  $scope.repetirLabels = ["Yes", "No", "I don't know"];
  $scope.repetirData = [];

  // function to evaluate if a number is even
    $scope.showSubmissionsPanel = function() {
      return ($scope.items && $scope.items.length > 0);
    };

    // add function to pass userInput to cloud via
    // $fh.cloud call to controller scope
    $scope.getNumberOfCharacters = function() {
      var userInput = $scope.userInput;

      //Notifying the user that the cloud endpoint is being called.
      $scope.noticeMessage = "Calling Cloud Endpoint";
      $scope.textClassName = "text-info";

      //Creating an AngularJS promise as the $fh.cloud function is asynchronous.
      var defer = $q.defer();

      var promise = defer.promise;

      //When the promise has completed, then the notice message can be updated to include result of the $fh.cloud call.
      promise.then(function(response){
        // If successful, display the length  of the string.
        if (response.msg != null && typeof(response.msg) !== 'undefined') {
          $scope.noticeMessage = response.msg;
          $scope.textClassName = "text-success";
        } else {
          $scope.noticeMessage  = "Error: Expected a message from $fh.cloud.";
          $scope.textClassName = "text-danger";
        }
      }, function(err){
        //If the function
        $scope.noticeMessage = "$fh.cloud failed. Error: " + JSON.stringify(err);
      });

      // check if userInput is defined
      if (userInput) {
        /**
         * Pass the userInput to the module containing the $fh.cloud call.
         *
         * Notice that the defer.resolve and defer.reject functions are passed to the module.
         * One of these functions will be called when the $fh.cloud function has completed successully or encountered
         * an error.
         */
        fhcloud.cloud('hello', userInput, defer.resolve, defer.reject);
      }
    };

    $scope.listSubmissions = function() {
      var userInput = $scope.userInput;

      //Notifying the user that the cloud endpoint is being called.
      $scope.noticeMessage = "Calling Cloud Endpoint";
      $scope.textClassName = "text-info";

      //Creating an AngularJS promise as the $fh.cloud function is asynchronous.
      var defer = $q.defer();

      var promise = defer.promise;

      //When the promise has completed, then the notice message can be updated to include result of the $fh.cloud call.
      promise.then(function(response){
        // If successful, display the length  of the string.
        if (response.code != null && typeof(response.code) !== 'undefined') {
          $scope.noticeMessage = response.code;
          $scope.textClassName = "text-success";

          $scope.items = response.submissions;
          var bucketExcelente = 0, bucketBuena = 0, bucketRegular = 0, bucketMala = 0, bucketPesima = 0;
          var bucketSi = 0, bucketNo = 0, bucketIndeciso = 0;
          for (var i = 0; i < $scope.items.length; i++) {
            var item = $scope.items[i];
            item.summary = '';
            for (var j = 0; j < item.fields.length; j++) {
              var field = item.fields[j];
              //console.log(JSON.stringify(field));
              if (field.name.match(/experience/i)) {
                item.experiencia = field.values[0];
                if (item.experiencia === 'Excellent') {bucketExcelente++;}
                else if (item.experiencia === 'Good') {bucketBuena++;}
                else if (item.experiencia === 'Average') {bucketRegular++;}
                else if (item.experiencia === 'Fair') {bucketMala++;}
                else if (item.experiencia === 'Poor') {bucketPesima++;}
              }
              if (field.name.match(/repeat/i)) {
                item.repetir = field.values[0];
                if (item.repetir === 'Yes') {bucketSi++;}
                else if (item.repetir === 'No') {bucketNo++;}
                else if (item.repetir === 'I don\'t Know') {bucketIndeciso++;}
              }
              if (field.name.match(/comments/i)) {
                item.comentarios = field.values[0];
              }
            }
          }
          $scope.experienciaData = [bucketExcelente, bucketBuena, bucketRegular, bucketMala, bucketPesima];
          $scope.repetirData = [bucketSi, bucketNo, bucketIndeciso];
        } else {
          $scope.noticeMessage  = "Error: Expected a message from $fh.cloud.";
          $scope.textClassName = "text-danger";
        }
      }, function(err){
        //If the function
        $scope.noticeMessage = "$fh.cloud failed. Error: " + JSON.stringify(err);
      });

      // check if userInput is defined
      //if (userInput) {
        fhcloud.cloud('submissions', userInput, defer.resolve, defer.reject);
      //}
    };

    $scope.pollerInterval = setInterval($scope.listSubmissions, 1000);
})
.controller('DashboardCtrl', ['$scope', '$q', 'fhcloud', function($scope, $q, fhcloud) {
  $scope.source = 'forms';
  $scope.options = {legend: {display: true}};
  $scope.experienciaLabels = ["Excellent", "Good", "Average", "Fair", "Poor"];
  $scope.experienciaData = [];
  $scope.repetirLabels = ["Yes", "No", "I don\'t know"];
  $scope.repetirData = [];
  $scope.items = [];

  $scope.togleSourceToBackend= function () {
    $scope.source = 'backend';
  };

  $scope.togleSourceToForms= function () {
    $scope.source = 'forms';
  };

  $scope.listSubmissions = function() {
    var userInput = $scope.userInput;

    //Notifying the user that the cloud endpoint is being called.
    $scope.noticeMessage = "Calling Cloud Endpoint";
    $scope.textClassName = "text-info";

    //Creating an AngularJS promise as the $fh.cloud function is asynchronous.
    var defer = $q.defer();

    var promise = defer.promise;

    //When the promise has completed, then the notice message can be updated to include result of the $fh.cloud call.
    promise.then(function(response){
      // If successful, display the length  of the string.
      if (response.code != null && typeof(response.code) !== 'undefined') {
        $scope.noticeMessage = response.code;
        $scope.textClassName = "text-success";

        $scope.items = response.submissions;
        var bucketExcelente = 0, bucketBuena = 0, bucketRegular = 0, bucketMala = 0, bucketPesima = 0;
        var bucketSi = 0, bucketNo = 0, bucketIndeciso = 0;
        for (var i = 0; i < $scope.items.length; i++) {
          var item = $scope.items[i];
          item.summary = '';
          for (var j = 0; j < item.fields.length; j++) {
            var field = item.fields[j];
            //console.log(JSON.stringify(field));
            if (field.name.match(/experience/i)) {
              item.experiencia = field.values[0];
              if (item.experiencia === 'Excellent') {bucketExcelente++;}
              else if (item.experiencia === 'Good') {bucketBuena++;}
              else if (item.experiencia === 'Average') {bucketRegular++;}
              else if (item.experiencia === 'Fair') {bucketMala++;}
              else if (item.experiencia === 'Poor') {bucketPesima++;}
            }
            if (field.name.match(/repeat/i)) {
              item.repetir = field.values[0];
              if (item.repetir === 'Yes') {bucketSi++;}
              else if (item.repetir === 'No') {bucketNo++;}
              else if (item.repetir === 'I don\'t know') {bucketIndeciso++;}
            }
            if (field.name.match(/comments/i)) {
              item.comentarios = field.values[0];
            }
          }
        }
        $scope.experienciaData = [bucketExcelente, bucketBuena, bucketRegular, bucketMala, bucketPesima];
        $scope.repetirData = [bucketSi, bucketNo, bucketIndeciso];
      } else {
        $scope.noticeMessage  = "Error: Expected a message from $fh.cloud.";
        $scope.textClassName = "text-danger";
      }
    }, function(err){
      //If the function
      $scope.noticeMessage = "$fh.cloud failed. Error: " + JSON.stringify(err);
    });

    if ($scope.source === 'backend') {
      fhcloud.cloud('submissions/data', null, defer.resolve, defer.reject);
    } else if ($scope.source === 'forms')  {
      fhcloud.cloud('submissions', null, defer.resolve, defer.reject);
    } else {
      fhcloud.cloud('submissions', null, defer.resolve, defer.reject);
    }
  };

  // Polling submissions!
  $scope.pollerInterval = setInterval($scope.listSubmissions, 1000);
}]);
