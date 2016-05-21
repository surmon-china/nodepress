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