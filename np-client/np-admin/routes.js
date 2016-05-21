angular.module('AdminRoutes', [])
.config(['$stateProvider', '$httpProvider', 'AdminConfig',
  function ($stateProvider, $httpProvider, AdminConfig) {

    /*

    // 配置路由
    $stateProvider

    // 总路由抽象
    .state('admin', {
      abstract: true,
      url: '/admin',
      controller: 'IndexController'
    })

    // 首页
    .state('admin.index', {
      url: '/index',
      templateUrl: AdminConfig.tmp_path + '/index.html',
      controller: 'IndexController',
      data: {
        title: '控制台首页',
        url: '/index'
      }
    })

    // 文章管理
    .state('admin.article', {
      abstract: true,
      url: '/article',
      controller: 'ArticleController'
    })

    // 发布文章
    .state('admin.article.new', {
      url: '/new',
      templateUrl: AdminConfig.tmp_path + '/article/edit.html',
      controller: 'ArticleController'
    })

    // 404路径，跳转至后台首页
    $urlRouterProvider.otherwise('/admin/index');

    // 启用H5模式
    $locationProvider.html5Mode(true);

    // 拦截器
    $httpProvider.interceptors.push(['$rootScope', '$q', '$localStorage', function ($rootScope, $q, $localStorage) {
      return {
        request: function (config) {
          return config;
        },
        response: function (response) {
          return $q.when(response);
        },

        responseError: function (response) {
          return $q.reject(response);
        }
      }
    }])
  

  */
  }
]);