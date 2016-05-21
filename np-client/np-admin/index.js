// 主程序入口模块
angular.module('NodePress', [

  // angular modules
  'ui.router',
  'ngStorage',
  'ngResource',
  'ngSanitize',
  'ngAnimate',

  // angular routes
  // 'AdminRoutes',

  // third modules

  // angular directive
  'LayoutDirective',

  // Function controller
  'ArticleController',
  'AsideController',
  'IndexController',
  'OptionController',
  'PageController',

  // Global Filter
  // 'HtmlFilter',
  // 'TimeFilter',

  // Global package
  // 'CommonProvider',

  // Global Service
  'CommonService',
])

// 全局配置
.provider('AdminConfig', function() {
  var config = {
    name: 'NorePress',
    subhead: 'Build on Love',
    site_path: location.host,
    url_path: 'http://' + location.host +　'/admin',
    api_path: 'http://' + location.host + '/api/admin',
    tmp_path: 'http://' + location.host + '/np-admin/layouts',
  };
  return { config: config, $get: function() { return config }}
})

// 初始化
.run(function() {
  console.log('程序启动');
})