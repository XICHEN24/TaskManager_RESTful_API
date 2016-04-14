var mp4Services = angular.module('mp4Services', []);

mp4Services.factory('CommonData', function(){
    var data = "";
    return{
        getData : function(){
            return data;
        },
        setData : function(newData){
            data = newData;
        }
    }
});

mp4Services.factory('Users', function($http, $window) {
    return {
        get : function() {
            var baseUrl = $window.sessionStorage.baseurl;
            console.log(baseUrl);
            return $http.get(baseUrl+'/api/users');
        },
         post : function(user) {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.post(baseUrl+'/api/users', user);
        },
         delete : function(id) {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.delete(baseUrl+'/api/users/'+id);
        },
        getquery : function(query) {
             var baseUrl = $window.sessionStorage.baseurl;
             console.log(baseUrl);
             return $http.get(baseUrl+'/api/users'+query);
        }
    }
});

mp4Services.factory('Usersid', function($http, $window) {
    return{
        get : function(id) {
             var baseUrl = $window.sessionStorage.baseurl;
             console.log(baseUrl);
             return $http.get(baseUrl+'/api/users/'+id);
        },
        put : function(id, user) {
            var baseUrl = $window.sessionStorage.baseurl;
             return $http.put(baseUrl+'/api/users/'+id, user);
        }
    }    
});
mp4Services.factory('Tasksid', function($http, $window) {
    return{
        get : function(id) {
             var baseUrl = $window.sessionStorage.baseurl;
             console.log(baseUrl);
             return $http.get(baseUrl+'/api/tasks/'+id);
        },
        put : function(id, task) {
            var baseUrl = $window.sessionStorage.baseurl;
             return $http.put(baseUrl+'/api/tasks/'+id, task);
        }
    }    
});

mp4Services.factory('Tasks', function($http, $window) {
    return {
        get : function() {
            var baseUrl = $window.sessionStorage.baseurl;
            console.log(baseUrl);
            return $http.get(baseUrl+'/api/tasks');
        },
         post : function(task) {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.post(baseUrl+'/api/tasks', task);
        },
         delete : function(id) {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.delete(baseUrl+'/api/tasks/'+id);
        },
        getquery : function(query) {
             var baseUrl = $window.sessionStorage.baseurl;
             console.log(baseUrl);
             return $http.get(baseUrl+'/api/tasks'+query);
        }
    }
});
