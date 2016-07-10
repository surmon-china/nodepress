/**
 * 全局布局模块
 *
 * @description
 * AngularJS app Layout.
 */

angular.module('LayoutDirective', [])

// 顶部
.directive('header', function() {
  return {
    restrict: 'EA',
    templateUrl: '/np-admin/layouts/header.html'
  };
})

// 边栏
.directive('aside', function() {
  return {
    restrict: 'EA',
    templateUrl: '/np-admin/layouts/aside.html'
  };
})

// 底部
.directive('footer', function() {
  return {
    restrict: 'EA',
    templateUrl: '/np-admin/layouts/footer.html'
  };
})

// Remove ng-include tag
.directive('includeReplace', function () {
  return {
    require: 'ngInclude',
    restrict: 'A',
    link: function (scope, element, attrs) {
      element.replaceWith(element.children());
    }
  };
})