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

  $scope.adide = {};

  $scope.adide.menus = [{
    name: '文章管理',
    childrens: [{
      name: '发布文章',
      url: '/article/new'
    },{
      name: '所有文章',
      url: '/article/all'
    },{
      name: '分类目录',
      url: '/article/category'
    },{
      name: '文章标签',
      url: '/article/tag'
    }]
  },{
    name: '页面管理',
    childrens: [{
      name: '新建页面',
      url: '/page/new'
    },{
      name: '所有页面',
      url: '/page/all'
    }]
  },{
    name: '菜单管理',
    url: '/menus'
  },{
    name: '评论管理',
    url: '/comments'
  },{
    name: '个人资料',
    url: '/user'
  },{
    name: '主题管理',
    url: '/themes'
  },{
    name: '文件管理',
    url: '/files'
  },{
    name: '扩展管理',
    url: '/plugins'
  },{
    name: '代码管理',
    url: '/ide'
  },{
    name: '全局设置',
    childrens: [{
      name: '基本设置',
      url: '/options/base'
    },{
      name: '高级设置',
      url: '/options/senior'
    },{
      name: '其他设置',
      url: '/options/others'
    }]
  },{
    name: '自定义配置',
    url: '/custom'
  }];

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