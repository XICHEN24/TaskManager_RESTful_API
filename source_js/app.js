var app = angular.module('mp4', ['ngRoute', 'mp4Controllers', 'mp4Services','720kb.datepicker']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
  when('/llamalist', {
    templateUrl: 'partials/llamalist.html',
    controller: 'UserListController'
  }).
  when('/newuser', {
    templateUrl: 'partials/newuser.html',
    controller: 'UserListController'
  }).
  when('/userdetail/:id',{
      templateUrl: 'partials/userdetail.html',
      controller: 'UserDetailController'
    }).
  when('/tasklist', {
    templateUrl: 'partials/tasklist.html',
    controller: 'TaskListController'
  }).
  when('/newtask', {
    templateUrl: 'partials/newtask.html',
    controller: 'TaskListController'
  }).
  when('/taskdetail/:id',{
      templateUrl: 'partials/taskdetail.html',
      controller: 'TaskDetailController'
    }).
  when('/taskdetail/:id/edittask',{
      templateUrl: 'partials/edittask.html',
      controller: 'TaskDetailController'
    }).
  when('/settings', {
    templateUrl: 'partials/settings.html',
    controller: 'SettingsController'
  }).
  when('/firstview', {
    templateUrl: 'partials/firstview.html',
    controller: 'FirstController'
  }).
  when('/secondview', {
    templateUrl: 'partials/secondview.html',
    controller: 'SecondController'
  }).
  otherwise({
    redirectTo: '/settings'
  });
}]);

app.filter('unique', function() {
   return function(collection, keyname) {
      var unique = [];
      var keys = [];
      angular.forEach(collection, function(item) {
          var key = item[keyname];
          if(keys.indexOf(key) == -1) {
              keys.push(key);
              unique.push(item);
          }
      });
      return unique;
   };
});
app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});