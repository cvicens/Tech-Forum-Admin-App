'use strict';

var myApp = angular.module('myApp', ['ngRoute',
    'ngSanitize',
    'myApp.controllers',
    'myApp.directives',
    'myApp.services',
    'myApp.filters',
    'snap',
    'fhcloud'
]);

myApp.config(function($routeProvider) {
    $routeProvider
        .when('/ex', {
            templateUrl: 'views/example.html',
            controller: 'MainCtrl'
        })
        .when('/submissions', {
            templateUrl: 'views/submissions.html',
            controller: 'MainCtrl'
        })
        .when('/list', {
            templateUrl: 'views/list.html',
            controller: 'DashboardCtrl'
        })
        .when('/dashboard', {
            templateUrl: 'views/dashboard.html',
            controller: 'DashboardCtrl'
        })
        .when('/', {
            templateUrl: 'views/dashboard.html',
            controller: 'DashboardCtrl'
        })
});
