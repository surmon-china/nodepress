
// 全局数据常量
const AdminConfig = {
	name: 'NorePress',
	subhead: 'Build on Love',
	site_path: location.host,
	url_path: 'http://' + location.host +　'/admin',
	api_path: 'http://' + location.host + '/api/admin',
	tmp_path: 'http://' + location.host + '/np-admin/layouts/',
};

// 构建程序
angular.module('NodePress', [
  'ui.router',
  'ngStorage'
])

// 过滤器模块------------------------------------------------------------------------------------------

// 路由模块--------------------------------------------------------------------------------------------

.config(['$stateProvider', '$urlRouterProvider','$httpProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider){

  // 404路径，跳转至后台首页
  $urlRouterProvider.otherwise('/admin');

  $stateProvider

	// 首页
  .state('index', {
    url: AdminConfig.url_path + '/',
    templateUrl: AdminConfig.tmp_path + '/layouts/index.html',
    controller: 'IndexController',
    data: {
      title: '控制台首页',
      url: '/index'
    }
  })

  // 启用H5模式
  $locationProvider.html5Mode(true);

}])

// 控制器模块------------------------------------------------------------------------------------------

// 全局父控制器
.controller('MainController', ['$scope','$http','$rootScope','$location',function($scope,$http,$rootScope,$location) {

}])

// Aside边栏控制器
.controller('AsideController', ['$scope','$http','$rootScope','$location',function($scope,$http,$rootScope,$location) {

}])

// 首页控制器
.controller('IndexController', ['$scope','$http','$rootScope','$location',function($scope,$http,$rootScope,$location) {

}])

// 文章页控制器
.controller('SingleController', ['$scope','$http','$rootScope',function($scope,$http,$rootScope) {

}])

// 独立页面路由
.controller('PageController', ['$scope','$http','$rootScope','$location',function($scope,$http,$rootScope,$location) {

}])

// 列表页控制器
.controller('ArchiveController', ['$scope','$http','$rootScope',function($scope,$http,$rootScope) {

}])

// 模板模块------------------------------------------------------------------------------------------

// 顶部
.directive('header', function() {
  return {
  restrict: 'EA',
  templateUrl: AdminConfig.tmp_path + '/header.html'
  };
})

// 边栏
.directive('aside', function() {
  return {
  restrict: 'EA',
  templateUrl: AdminConfig.tmp_path + '/aside.html'
  };
})

// 底部
.directive('footer', function() {
  return {
	restrict: 'EA',
	templateUrl: AdminConfig.tmp_path + '/footer.html'
  };
})