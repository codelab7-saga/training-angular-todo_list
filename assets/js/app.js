var app = angular.module('todoApp', ["ngRoute"])

//Adding Menu
app.controller('MenuController', function ($scope, $http) {

    //Getting menu from remote Location
    $http.get("./assets/json/menu.json")
            .then(function (response) {
                $scope.iteams = response.data.MenuIteams;
            });

    //Check if this is Main menu with no child menu
    $scope.isMainMenuIteam = function (iteam) {
        if (iteam.perent == 0) {
            return true;
        }
    }

    //Check if menu has child
    $scope.hasChild = function (id) {
        var result = false;
        angular.forEach($scope.iteams, function (value) {
            if (value.perent == id) {
                result = true;
            }
        });
        return result;
    }

    //Filter for Only show child Menu Iteams
    $scope.childOf = function (iteam, perent) {
        console.log([iteam, perent]);
    }

});

app.controller('dashboardController', function ($scope) {
    $scope.content = "Wellcome to app singlepage app";
});

app.controller('viewController', function ($scope, tasksService) {
    $scope.tasks = tasksService.getTasks();
    $scope.anyRemainingTask = function (isthere) {
        var result = false;
        angular.forEach($scope.tasks, function (value) {
            if (value.done !== isthere) {
                result = true;
            }
        });
        return result;
    }
});

app.controller('newController', function ($scope, tasksService, Data) {
    $scope.catgories = Data;
    $scope.addTask = function () {
        var newTask = [];
        newTask.name = $scope.taskName;
        newTask.cate = $scope.selectedCatagory;
        newTask.priority = $scope.priority;
        newTask.done = false;
        tasksService.addTask(newTask);
        $scope.taskName = '';
        $scope.selectedCatagory = '';
        $scope.priority = '';
        $scope.status = "Task Recorded Successfully";
        setTimeout(function () {
            $scope.status = null;
        }, 1000);
    };
    $scope.addCategory = function () {
        Data.push($scope.newCategory);
        $scope.newCategory = '';
        $scope.catStatus = "Category Added Successfully";
        setTimeout(function () {
            $scope.catStatus = null;
        }, 1000);
    }
});

app.filter('importancePriority', function () {
    function CustomOrder(item) {
        switch (item) {
            case 'important':
                return 1;

            case 'normal':
                return 2;

            case 'low':
                return 3;

            case 'maybe':
                return 4;
        }
    }
    return function (items, field) {
        var filtered = [];
        angular.forEach(items, function (item) {
            filtered.push(item);
        });
        filtered.sort(function (a, b) {
            return (CustomOrder(a.priority) > CustomOrder(b.priority) ? 1 : -1);
        });
        return filtered;
    };
});

app.factory('Data', function () {
    return ['General', 'Office'];
});

app.service('tasksService', function () {
    var tasksList = [];

    var addTask = function (newObj) {
        tasksList.push(newObj);
    };

    var getTasks = function () {
        return tasksList;
    };

    return {
        addTask: addTask,
        getTasks: getTasks
    };
});

app.config(function ($routeProvider) {
    $routeProvider
            .when("/", {
                templateUrl: "./template/dashboard.html",
                controller: "dashboardController"
            })
            .when("/view", {
                templateUrl: "./template/view.html",
                controller: "viewController"
            })
            .when("/new", {
                templateUrl: "./template/new.html",
                controller: "newController"
            });
});