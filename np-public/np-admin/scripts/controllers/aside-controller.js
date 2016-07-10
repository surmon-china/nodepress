/*
* AsideController Module
*
* Description
*/
angular.module('AsideController', [])
.controller('AsideController', ['$scope', '$rootScope', '$location', '$localStorage', 'AdminConfig',
  function ($scope, $rootScope, $location, $localStorage, AdminConfig) {

    console.log('AsideController');

    $scope.adide = {};

    $scope.adide.menus = [{
      name: '管理首页',
      url: '/index'
      }, {
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
      }, {
        name: '页面管理',
        childrens: [{
          name: '新建页面',
          url: '/page/new'
        },{
          name: '所有页面',
          url: '/page/all'
        }]
      }, {
        name: '菜单管理',
        url: '/menus'
      }, {
        name: '评论管理',
        url: '/comments'
      }, {
        name: '个人资料',
        url: '/user'
      }, {
        name: '主题管理',
        url: '/themes'
      }, {
        name: '文件管理',
        url: '/files'
      }, {
        name: '扩展管理',
        url: '/plugins'
      }, {
        name: '代码管理',
        url: '/ide'
      }, {
        name: '全局设置',
        childrens: [{
          name: '程序信息',
          url: '/options/system'
        },{
          name: '基本设置',
          url: '/options/base'
        },{
          name: '高级设置',
          url: '/options/senior'
        },{
          name: '其他设置',
          url: '/options/others'
        }]
      }, {
        name: '自定义配置',
        url: '/custom'
      }];

  }
]);