var mp4Controllers = angular.module('mp4Controllers', []);

mp4Controllers.controller('UserListController', ['$scope', '$http', 'Users', 'Usersid', 'Tasksid', '$window' , function($scope, $http, Users, Usersid, Tasksid, $window) {

  $scope.name = "";
  $scope.email = "";
  $scope.successmessage = "Alert message:";
  $scope.deletemessage = "Delete a user?";
  $scope.putmessage="update task?"
  $scope.temp = false;
  Users.get().success(function(data){
    $scope.users = data.data;
  });
  

  $scope.sendPost = function() {
       var newdata = {
                "name": $scope.name,
                "email": $scope.email
            };

    Users.post(newdata).success(function(data, status) {
              $scope.successmessage = data.message;
          }).error(function(err){
              $scope.successmessage = err.message;
          });
       
  };
  $scope.deleteuser = function(id) {
      Usersid.get(id).success(function(data){
        $scope.deleteuser = data.data;
   
      var array = $scope.deleteuser.pendingTasks;
      console.log($scope.deleteuser.pendingTasks);

      Users.delete(id).success(function(data, status){
          $scope.deletemessage = data.message;
          if(array!=[]){
            for(var i =0;i<array.length;i++){
              Tasksid.get(array[i]).success(function(data){
                $scope.selectTask = data.data;
            
              var newtask = {
                      "name": $scope.selectTask.name,
                      "deadline": $scope.selectTask.deadline,
                      "description": $scope.selectTask.description,
                      "assignedUser":'',
                      "assignedUserName":'unassigned',
                      "dateCreated": $scope.selectTask.dateCreated,
                      "completed": $scope.selectTask.completed
                  };
              Tasksid.put($scope.selectTask._id,newtask).success(function(data){
                $scope.putmessage = data.message;
              }).error(function(err){
                 $scope.putmessage = data.message;
              })
              })
            }
        }
      }).error(function(err){
              $scope.deletemessage = err.message;
      });
     }); 
  };   
 // $scope.$watch($scope.deleteuser,$scope.refresh,true);

}]);

mp4Controllers.controller('SettingsController', ['$scope' , '$window' , function($scope, $window) {
  $scope.url = $window.sessionStorage.baseurl;

  $scope.setUrl = function(){
    $window.sessionStorage.baseurl = $scope.url;
    $scope.displayText = "URL set";

  };

}]);

mp4Controllers.controller('UserDetailController',['$scope','$http','Users', 'Usersid', 'Tasks', 'Tasksid', '$routeParams', function($scope, $http, Users, Usersid, Tasks, Tasksid, $routeParams){
    $scope.userid = $routeParams.id;
    $scope.tasklength = 0;
    $scope.list = ['aaaaa'];
    $scope.putmessage="Task status";
    //console.log($routeParams.id);
    
    Usersid.get($scope.userid).success(function(data){
      $scope.user = data.data;
      $scope.tasklength = $scope.user.pendingTasks.length;
      //$scope.list=[];
      //?where={"completed": false, '_id':"570c65c40c10143e7cb201a3"}
      //var query = '?where={"completed": false, "assignedUser":"'+$scope.userid +'"}';
      //var query = '?where={"completed": false}';
      Tasks.getquery('?where={"completed": false, "assignedUser":"'+$scope.userid +'"}').success(function(data){
          $scope.list = data.data;
          console.log($scope.list);

      })
    });

    Usersid.get($scope.userid).success(function(data){
      $scope.user = data.data;
      $scope.tasklength = $scope.user.pendingTasks.length;
      //$scope.list=[];
      //?where={"completed": false, '_id':"570c65c40c10143e7cb201a3"}
      //var query = '?where={"completed": false, "assignedUser":"'+$scope.userid +'"}';
      //var query = '?where={"completed": false}';
      Tasks.getquery('?where={"completed": true, "assignedUser":"'+$scope.userid +'"}').success(function(data){
          $scope.listcp = data.data;
          console.log($scope.list);
      })
    });
    $scope.changeComplete=function(id){
        Tasksid.get(id).success(function(data){
          $scope.selectTask = data.data;
          
          var newtask = {
                  "name": $scope.selectTask.name,
                  "deadline": $scope.selectTask.deadline,
                  "description": $scope.selectTask.description,
                  "assignedUser":$scope.selectTask.assignedUser,
                  "assignedUserName":$scope.selectTask.assignedUserName,
                  "dateCreated": $scope.selectTask.dateCreated,
                  "completed": true
              };
          console.log(newtask)
          Tasksid.put(id,newtask).success(function(data){
            $scope.putmessage = data.message;
            Tasksid.get(id).success(function(data){
              console.log(data.data);
            })
          }).error(function(err){
            $scope.putmessage = err.message;
          })
        })
        Usersid.get($scope.userid).success(function(data){
          $scope.selectuser = data.data;
          var temparray=[];
          for (var i=0;i<$scope.selectuser.pendingTasks.length;i++){
              if($scope.selectuser.pendingTasks[i]!=id)
                temparray.push($scope.selectuser.pendingTasks[i]);
          }
          var newuser = {
                    "name": $scope.selectuser.name,
                    "email": $scope.selectuser.email,
                    "pendingTasks": temparray,
                    "dateCreated": $scope.selectuser
                }
          console.log(newuser);
          Usersid.put($scope.selectuser._id,newuser).success(function(data){ 
          })
    });
  }




    $scope.showTask = function(){
        $scope.temp = true;
    };
}]);

mp4Controllers.controller('TaskListController', ['$scope', '$http', 'Users', 'Tasks','Usersid', 'Tasksid', '$window' , function($scope, $http, Users, Tasks, Usersid, Tasksid, $window) {
/*
  Tasks.get().success(function(data){
    $scope.tasks = data.data;
    
  });
*/
Tasks.getquery('?where={"completed": false}').success(function(data){
          $scope.task = data.data;
})  
  $scope.Page = 0;
  $scope.Size = 10;
  $scope.num=function(){
      return Math.ceil($scope.task.length/$scope.Size);                
  }

  $scope.set=function(num){
    if (num ==0){
      var query = '?where={"completed": false}';

      Tasks.getquery(query).success(function(data){
          $scope.task = data.data;
      })
    }
    if (num ==1){
      var query = '?where={"completed": true}';
      Tasks.getquery(query).success(function(data){
          $scope.task = data.data;
      })
    }
    if (num ==2){
      Tasks.get().success(function(data){
          $scope.task = data.data;
      })
    }
  }

  $scope.setoption = {completed: false};
  //console.log($scope.setoption);
  $scope.order='dateCreated';

  $scope.list = true;
  
  $scope.tasknum = 0;

  $scope.taskname = "";
  $scope.description = "";
  $scope.message = "Update Message:";
  $scope.date = "";
  $scope.assignedUserName = "";
  $scope.assignedUser=""; 
  $scope.putmsg = "Update Message";
  $scope.deletemsg = "Delete Message";

   Users.get().success(function(data){
      $scope.users = data.data;
    });
  
   $scope.deletetask = function(id){
    Tasksid.get(id).success(function(data){
        $scope.msg=data.message;
        $scope.deletetask = data.data;
        var deleteuserid = $scope.deletetask.assignedUser;

        Tasks.delete(id).success(function(data){
            $scope.deletemsg = data.message;
            Usersid.get(deleteuserid).success(function(data){
                var deletename = data.data.name;
                var deletepending = data.data.pendingTasks;
                var deleteemail = data.data.email;
                var deletedata = data.data.dateCreated;
                var deleteid = data.data._id;

                var newarray = [];
                for(var i=0; i<deletepending.length; i++){
                  if(deletepending[i] != id){
                    newarray.push(deletepending[i])
                  }
                }
                var newuser = {
                    "name": deletename,
                    "email": deleteemail,
                    "pendingTasks": newarray,
                    "dateCreated": deletedata
                }

                Usersid.put(deleteid,newuser).success(function(data){
                    console.log(data.data);
                    $scope.putmsg = data.message;
                }).error(function(err){
                    $scope.putmsg = err.message;
                });
            })
        }).error(function(err){
          $scope.deletemsg = err.message;
        })
    })
  }


  $scope.sendTask = function() {
    
      Users.get().success(function(data){
        $scope.user = data.data;
        for(var i=0; i<$scope.user.length; i++){
          if($scope.user[i].name == $scope.assignedUserName){
            $scope.assignedUser = $scope.user[i]._id;          
          }
        }
        //console.log($scope.assignedUser);
        //console.log($scope.assignedUser);
      
      var newdata = {
                  "name": $scope.taskname,
                  "description": $scope.description,
                  "deadline":$scope.date,
                  "assignedUserName": $scope.assignedUserName,
                  "assignedUser": $scope.assignedUser,
                  "completed": false
      };
        console.log(newdata);
        Tasks.post(newdata).success(function(data, status) {
                $scope.message = data.message;
                $scope.newid = data.data._id;

                Usersid.get($scope.assignedUser).success(function(data){
                $scope.edituser = data.data;
                console.log(data.data.pendingTasks);
                console.log("hi");
                var array = data.data.pendingTasks;
                array.push($scope.newid)
                console.log(array);
                //console.log(data.data);
                //console.log($scope.array);
                var newuser = {
                    "name": $scope.edituser.name,
                    "email": $scope.edituser.email,
                    "pendingTasks": array
                }
                //console.log($scope.newid);
                //console.log($scope.array);
                Usersid.put($scope.edituser._id,newuser).success(function(data){
                  console.log(data.data);
                })

            }).error(function(err){
            });
        }).error(function(err){
          $scope.message = err.message;
        })   
        })
    };
}]);

mp4Controllers.controller('TaskDetailController',['$scope','$http','Users', 'Tasks','Tasksid', '$routeParams', function($scope, $http, Users, Tasks, Tasksid, $routeParams){

  $scope.taskid = $routeParams.id;
  $scope.editmsg = "Alert Message";
  $scope.choices = [{text:"completed",isUserAnswer:true},{text:"pending",isUserAnswer:false}];
  $scope.choice = false;
  //console.log($scope.choice);
  Tasks.get().success(function(data){
        $scope.taskdata = data.data;
        for(var i=0; i < $scope.taskdata.length;i++){
          if ($scope.taskdata[i]._id == $scope.taskid){
            $scope.task = $scope.taskdata[i];
          }
        }
        $scope.id = $scope.task._id;
        //console.log($scope.id);
        $scope.taskname = $scope.task.name;
        $scope.description = $scope.task.description;
        //$scope.data = $scope.task.deadline;
        //$scope.assignedUserName = $scope.task.assignedUserName;
        $scope.assignedUser = $scope.task.assignedUser;
        //console.log($scope.task);
    });

  Users.get().success(function(data){
      $scope.user = data.data;
    });
  console.log($scope.users);

  $scope.editTask = function() {
      Users.get().success(function(data){
        $scope.users = data.data;
        for(var i=0; i<$scope.users.length; i++){
        if($scope.users[i].name == $scope.assignedUserName){
          $scope.assigned = $scope.users[i]._id;
        }
      }
     
      console.log($scope.assigned);
       var newdata = {
                "name": $scope.taskname,
                "description": $scope.description,
                "deadline":$scope.date,
                "assignedUserName": $scope.assignedUserName,
                "assignedUser": $scope.assigned,
                "completed": $scope.choice
            };
      console.log(newdata);
      Tasksid.put($scope.id,newdata).success(function(data, status) {
              $scope.editmsg = data.message;
          }).error(function(err){
              $scope.editmsg = err.message;
          });
  
    });
    };
}]);

/*
mp4Controllers.controller('FirstController', ['$scope', 'CommonData'  , function($scope, CommonData) {
  $scope.data = "";
   $scope.displayText = ""

  $scope.setData = function(){
    CommonData.setData($scope.data);
    $scope.displayText = "Data set"

  };

}]);

mp4Controllers.controller('SecondController', ['$scope', 'CommonData' , function($scope, CommonData) {
  $scope.data = "";

  $scope.getData = function(){
    $scope.data = CommonData.getData();

  };

}]);

*/

/*
  $scope.change = function(num){
    
    if($scope.list ==true && num ===0){
      $scope.list = true;
    }
    else if ($scope.list ==true && num === 1){
      $scope.order = '-'+$scope.order;
      $scope.list = false;
    }
    else if ($scope.list ==false && num ===0){
      $scope.order = '-'+$scope.order;
      $scope.list = true;
    }
    else{
      $scope.list = false;
    }
  };
*/
/*   
      for (var i =0;i<$scope.user.pendingTasks.length;i++)
      {
          var query = '?where={"completed": false,"_id":"'+$scope.user.pendingTasks[i]+'"}';
          console.log(query);
          Tasks.getquery(query).success(function(data){
              console.log(data.data);
              $scope.list.push(data.data);
          }).error(function(err){
            //$scope.message = err.message;
          });
     }
     console.log($scope.list[0]);
     */
      //console.log($scope.tasklength);
      /*
      for(var i=0; i<$scope.tasklength;i++){
          var id = $scope.user.pendingTasks[i];
          Tasksid.get($scope.user.pendingTasks[i]).success(function(data){
              var task = data.data;
              console.log(task);
              $scope.list.push(task);
          });
        };
      */
    
    
    
    /*
    Tasks.get().success(function(data){
      $scope.tasks = data.data;
      for(var i=0;i<$scope.tasks.length;i++){
        if($scope.tasks[i].assignedUser == $scope.user._id){
          console.log($scope.tasks[i].assignedUser);
          $scope.list.push($scope.tasks[i]);
        }
      }
    });
    */






