// ------------------------------------------------------------------------------------------

// 全局数据常量
const blogInfo = {
	name: '司马萌',
	subhead: '欢喜勇猛 向死而生',
	description: '凡心所向，素履所往，生如逆旅，一苇以航。',
	keywords: '司马萌,马赐崇,javascript,前端技术,nocower,surmon,wordpress-AngularJs',
	path: location.host,
	url: 'http://' + location.host,
	api: 'http://' + location.host + '/api',
	templateUrl: 'http://' + location.host + '/np-themes/Surmon/layouts/',
	duoshuoShortName: 'surmon',
  musicPlayerAutoLoad: true,
  musicPlayerAutoPlay: true
};

// 多说短域
window.duoshuoQuery = {
	short_name: blogInfo.duoshuoShortName
};

// 功能模块------------------------------------------------------------------------------------------

// 分页数据生成模块
var pageNavi = function(pageTotal,active){
	var navs = [];
	for (var i = 1; i <= pageTotal; i++) {
		navs.push(i);
	}
	var navInfo = new Object();
	navInfo.navs = navs;
	navInfo.total = pageTotal;
	navInfo.active = active == undefined ? 1 : active;
	return navInfo;
	console.log(navInfo);
};

// 构建程序
angular.module('Surmon', ['ngRoute', 'angular-duoshuo', 'angular-carousel', 'angular-music-player'])

// 过滤器模块------------------------------------------------------------------------------------------

// 日期过滤器
.filter('toSec', function($filter) {
  return function(input) {
      var result = new Date(input).getTime();
      return result || '';
  };
})

// 数据标签转义（生效）使用： | trustAsHtm
.filter('trustAsHtml', ['$sce', function ($sce) {
	return function (text) {
	    return $sce.trustAsHtml(text);
	};
}])

// 数据标签文本化（去标签/正则表达式匹配）使用：| stripTags
.filter('stripTags', function() {
  return function(str) {
    return str.replace(/<p>|<\/p>|<br \/>|\[|&hellip;|\]/ig, '');
  }
})

// 路由模块------------------------------------------------------------------------------------------

.config(['$routeProvider','$httpProvider','$locationProvider', function($routeProvider, $httpProvider, $locationProvider){
	$routeProvider
	// 首页
	.when('/',{
		templateUrl: blogInfo.templateUrl + 'index.html',
		controller:'Index'
	})
	// 文章内容页
	.when('/post/:post_id',{
		templateUrl: blogInfo.templateUrl + 'single.html',
		controller:'Single'
	})
	// 关于我
	.when('/about',{
		templateUrl: blogInfo.templateUrl + 'about.html',
		controller:'Page'
	})
	// music
	.when('/music',{
		templateUrl: blogInfo.templateUrl + 'music.html',
		controller:'Page'
	})
	// 电影
	.when('/movie',{
		templateUrl: blogInfo.templateUrl + 'movie.html',
		controller:'Page'
	})
	// 独立页面
	.when('/:page_id',{
		templateUrl: blogInfo.templateUrl + 'page.html',
		controller:'Page'
	})
	// 分类列表页，将应用于（搜索/作者/分类/标签/时间）列表
	.when('/:request_type/:request_id',{
		templateUrl: blogInfo.templateUrl + 'archive.html',
		controller:'Archive'
	})
	// 分类列表页，将应用于（二级分类）列表
	.when('/:request_type/:request_id/:child_id',{
		templateUrl: blogInfo.templateUrl + 'archive.html',
		controller:'Archive'
	})
	.otherwise({redirectTo: '/'});
	// 添加路由请求监听
	$httpProvider.interceptors.push('isLoading');
  // 启用H5模式
  $locationProvider.html5Mode(true);
}])

// 工厂模块------------------------------------------------------------------------------------------

// 配置请求拦截器
.factory('isLoading', ["$rootScope", function ($rootScope) {
	var isLoading = {
		request: function (config) {
			$rootScope.isLoadingStamp = true;
			// 获取最后一次请求的时间戳
			config.requestTimestamp = new Date().getTime();
			$rootScope.lastRequestTime = config.requestTimestamp;
			return config;
		},
		response: function (response) {
			// 核对时间戳确认最后一次请求已完成响应
			if ($rootScope.lastRequestTime == response.config.requestTimestamp) {
			   $rootScope.isLoadingStamp = false;
			}
			return response;
		}
	};
	return isLoading;
}])

// 控制器模块------------------------------------------------------------------------------------------

// 全局父控制器
.controller('Main', ['$scope','$http','$rootScope','$location','$timeout',function($scope,$http,$rootScope,$location,$timeout) {

	// 请求主题设置信息
 //  $http({
	// 	url: blogInfo.url + '/wp-admin/admin-ajax.php',
	// 	method:'GET',
	// 	params: { action: 'get_options' }
	// }).success(function(data,header,config,status){
	// 	console.log('请求到的后台的设置数据');
	// 	console.log(data);
	// }).error(function(){
	// 	alert('主题设置信息请求失败');
	// });

	// 全局数据
	$rootScope.blogInfo = blogInfo;
	// 全局title
	$rootScope.title = blogInfo.name + ' | ' + blogInfo.subhead;
	// 全局keywords
	$rootScope.keywords = blogInfo.keywords;
	// 全局描述/摘要
	$rootScope.description = blogInfo.description;
	// 全局获取缩略图
	$rootScope.getThumbnail = function (src, width, height) {
		var thumbWidth = width ? width : '300';
		var thumbheight = height ? height : '180';
		return $rootScope.blogInfo.templateUrl + 'timthumb.php?src=' + src + '&h=' + thumbheight + '&w=' + thumbWidth + '&q=100&zc=1'
	};

  // 判断对象是否为空
  $rootScope.isNotNullObj = function (obj) {
    for(var i in obj){
      if(obj.hasOwnProperty(i)){
        return true;
      }
    }
    return false;
  }

}])

// Aside边栏控制器
.controller('Aside', ['$scope','$http','$rootScope','$location',function($scope,$http,$rootScope,$location) {

	// 获取标签请求
  $http({
		url: blogInfo.api + '/get_tag_index/',
		method:'GET'
	}).success(function(data,header,config,status){
		$scope.tags = data.tags;
	}).error(function(){
		alert('侧边栏标签数据请求失败');
	});

	// 获取最新文章请求，供边栏使用
	$http({
		url: blogInfo.api + '/get_recent_posts/',
		method:'GET'
	}).success(function(data,header,config,status){
		// 数据传输给根控制器和首页数据形成绑定
		$rootScope.newPostsData = data;
		$scope.newPosts = $rootScope.newPostsData.posts;
	}).error(function(){
		alert('侧边栏文章数据请求失败');
	})

	// 搜索器模块
	$scope.search = function (keywords) {
		// 更改地址栏至搜索路径
		$location.path('/search/'+ keywords);
		console.log($location);
	}

	// 时钟模块
	$scope.clock = new Date();
  setInterval( function () {
    $scope.$apply( function () {
    	$scope.clock = new Date();
  	});
  }, 1000);

  //日历实例化
  $scope.day = moment();

}])

// 首页控制器
.controller('Index', ['$scope','$http','$rootScope','$location',function($scope,$http,$rootScope,$location) {

	$scope.route = null;

	// 文章获取机制
	$scope.getIndexArchive = function (pageIndex) {

		// 定义请求路径Url
		var getPageIndexUrl;
		// 如果请求第一页，则标示为首页
		if (pageIndex == undefined || pageIndex == 1) {
			getPageIndexUrl = blogInfo.api + '/get_recent_posts/';
			// 首页路由标示
			$scope.route = 'index';
		} else {
			// 否则请求列表页，且标识为首页列表
			getPageIndexUrl = blogInfo.api + '/get_recent_posts/?page=' + pageIndex;
			// 首页翻页路由标示
			$scope.route = 'indexList';
		};

		// 请求器
		$http({
			url: getPageIndexUrl,
			method:'GET'
		}).success(function(data,header,config,status){
			// 数据传输给根控制器和边栏数据形成绑定
			$rootScope.newPostsData = data;
			$scope.posts = $rootScope.newPostsData.posts;
			// console.log($scope.posts);
			$rootScope.title = blogInfo.name + ' | ' + blogInfo.subhead;
			$rootScope.keywords = blogInfo.keywords;
			$rootScope.description = blogInfo.description;
			$scope.newPostsData = $rootScope.newPostsData;
			$scope.pages = $scope.newPostsData.pages;
			$scope.posts = $scope.newPostsData.posts;
			$scope.postsTotal = $scope.newPostsData.count;
			$scope.allPostsTotal = $scope.newPostsData.count_total;
			$scope.pageNavi = pageNavi($scope.pages,pageIndex);
			// console.log($scope.pageNavi);
		}).error(function(){
			alert('首页文章队列数据请求失败');
		})
	};

	// 首次加载完成请求
	$scope.getIndexArchive(1);
	
	// 列表页翻页请求机制
	$scope.pageNaviTo = function (target) {
		$scope.getIndexArchive(target);
	}

}])

// 文章页控制器
.controller('Single', ['$scope','$http','$rootScope','$routeParams',function($scope,$http,$rootScope,$routeParams) {

	// 监控路由
	$scope.post_id = $routeParams.post_id;
	// 变更关键词
	$rootScope.keywords = '凡心所向，素履所往，生如逆旅，一苇以航。';

	// 路由机制
	$http({
		url: blogInfo.api + '/get_post/?id=' + $scope.post_id,
		method:'GET'
	}).success(function(data,header,config,status){
		// 文章数据
		$scope.single = data;
		// 上下篇
		data.previous_url ? $scope.post_prev_id = data.previous_url.replace(/[^0-9]/ig,"") : '';
		data.next_url ? $scope.post_next_id = data.next_url.replace(/[^0-9]/ig,"") : '';
		// 变更文档标题
		$rootScope.title = data.post.title + ' | ' + blogInfo.name;
		// 变更描述
		$rootScope.description = data.post.excerpt;
		console.log($scope.single);

		// 内容请求成功，请求评论
		$scope.single.post.custom_fields.duoshuo_thread_id ? $scope.duoshuo_id = $scope.single.post.custom_fields.duoshuo_thread_id[0] : '';

		// 请求成功后执行请求相关文章
		$scope.getRelatedSingle();
	}).error(function(){
		alert('文章页请求数据失败');
	});

	// 请求相关文章
	$scope.getRelatedSingle = function () {


		// 请求cate相关数据
			$http({
				url: blogInfo.api + '/get_category_posts/?slug=' + $scope.single.post.categories[0].slug,
				method:'GET'
			}).success(function(data,header,config,status){
				$scope.relatedCateSingle = data.posts;

				// 如果不存在tag则停止请求,把同分类文章作为相关文章
				$scope.relatedSingles = $scope.relatedCateSingle;
				if ($scope.single.post.tags.length == 0) {
					return false;
				};

				// 请求Tag相关数据
				$http({
					url: blogInfo.api + '/get_tag_posts/?slug=' + $scope.single.post.tags[0].slug,
					method:'GET'
				}).success(function(data,header,config,status){
					$scope.relatedTagSingle = data.posts;

					// 合并数据
					$scope.relatedSingles = $scope.relatedCateSingle.concat($scope.relatedTagSingle);

					// 删除重复数据
					for (var i = 0; i < $scope.relatedSingles.length; i++) {
						for (var j = i + 1; j < $scope.relatedSingles.length; j++) {
							if ($scope.relatedSingles[i].id == $scope.relatedSingles[j].id) {
								$scope.relatedSingles.splice(j, 1);
							}
						}
					};

				}).error(function(){
					alert('文章页cate相关请求数据失败');
				});

		}).error(function(){
			alert('文章页tag相关文章请求失败');
		});
	};

}])

// 独立页面路由
.controller('Page', ['$scope','$http','$rootScope','$routeParams','$location',function($scope,$http,$rootScope,$routeParams,$location) {

	// 监控路由
	if ($routeParams.page_id) {
		$scope.page_id = $routeParams.page_id;
	} else {
		// 若是固定页面，则通过地址栏获取别名，且改变布局为通栏
		$scope.page_id = $location.$$url.replace("/","");
		$rootScope.article_full_layout = true;
	};

	/*路径跳出则使布局恢复正常*/
  $scope.$on('$locationChangeStart', function() {
  	$rootScope.article_full_layout = false;
  });

	// 请求内容
	$http({
		url: blogInfo.api + '/get_page/?slug=' + $scope.page_id,
		method:'GET'
	}).success(function(data,header,config,status){
		$scope.page = data.page;
		// console.log(data);

		// 内容请求成功，请求评论
		$scope.duoshuo_id = $scope.page.custom_fields.duoshuo_thread_id[0];

		// $rootScope.getComment($scope.page.custom_fields.duoshuo_thread_id[0]);
	}).error(function(){
		alert('请求异常');
	});

}])

// 列表页控制器
.controller('Archive', ['$scope','$http','$rootScope','$routeParams',function($scope,$http,$rootScope,$routeParams) {

	// 监听路由类型
	$scope.request_type = $routeParams.request_type;
	// 监听路由参数，判断二级分类
	$scope.request_id = $routeParams.child_id == undefined ? $routeParams.request_id : $routeParams.child_id;
	// 监听是否为搜索页
	$scope.date_type = $routeParams.request_type == 'search' ? 'results' : 'posts';
	// 定义列表页识别标示
	$scope.route = $scope.request_type;

	// 文章获取机制
	$scope.getArchiveList = function (pageIndex) {

		// API请求类型判断
		$scope.request_var = function () {
			if ($routeParams.request_type == 'category' || $routeParams.request_type == 'tag' || $routeParams.request_type == 'author') {
				return 'slug';
			} else {
				return $routeParams.request_type;
			}
		};

		// 列表请求机制
		$http({
			url: blogInfo.api + '/get_' + $scope.request_type + '_'+ $scope.date_type +'/?' + $scope.request_var() + '=' + $scope.request_id + '&page=' + pageIndex,
			method:'GET'
		}).success(function(data,header,config,status){
			// 数据返回成功后
			$scope.data = data;
			if ($scope.route == 'search') {
				$scope.data.key = $scope.request_id;
			};
			if ($scope.route == 'date') {
				$scope.data.date = $scope.request_id;
			};
			$scope.posts = data.posts;
			$scope.pages = data.pages;
			$scope.pageNavi = pageNavi($scope.pages,pageIndex);
			// console.log($scope.data);
		}).error(function(){
			alert('列表页请求失败');
		})
	};

	// 首次加载完成请求
	$scope.getArchiveList(1);

	// 列表页翻页请求机制
	$scope.pageNaviTo = function (target) {
		console.log('列表页请求到第' + target + '页');
		$scope.getArchiveList(target);
	}

}])

// 模板模块------------------------------------------------------------------------------------------

// 加载中动画
.directive('loading', function() {
  return {
	restrict: 'EA',
	replace: true ,
	template: '<div class="loading slide-down"><div></div><div></div><div></div><div></div><div></div></div>'
  };
})

// 头部模块
.directive('header', function() {
  return {
	restrict: 'EA',
	// replace: true ,
	templateUrl: blogInfo.templateUrl + 'header.html',
	link: function($scope, $element, $attrs) {
		// 处理加载完成事件
		// loaded($element);
	  }
  };
})
// 边栏
.directive('aside', function() {
  return {
	restrict: 'EA',
	// replace: true ,
	templateUrl: blogInfo.templateUrl + 'aside.html'
  };
})
// 底部
.directive('footer', function() {
  return {
	restrict: 'EA',
	// replace: true ,
	templateUrl: blogInfo.templateUrl + 'footer.html'
  };
})
// 文章列表
.directive('archive', function() {
  return {
	restrict: 'EA',
	replace: true ,
	templateUrl: blogInfo.templateUrl + 'archive.html'
  };
})
// 评论
.directive('comment', function() {
  return {
	restrict: 'EA',
	replace: true ,
	templateUrl: blogInfo.templateUrl + 'comment.html'
  };
})
// 日历
.directive("asideCalendar", function() {
  return {
    restrict: "EA",
    templateUrl: blogInfo.templateUrl + '/calendar.html',
    scope: {
      selected: "="
    },
    link: function(scope) {
      scope.selected = _removeTime(scope.selected || moment());
      scope.month = scope.selected.clone();

      var start = scope.selected.clone();
      start.date(1);
      _removeTime(start.day(0));

      _buildMonth(scope, start, scope.month);

      scope.select = function(day) {
        scope.selected = day.date;  
      };

      scope.next = function() {
        var next = scope.month.clone();
        _removeTime(next.month(next.month()+1).date(1));
        scope.month.month(scope.month.month()+1);
        _buildMonth(scope, next, scope.month);
      };

      scope.previous = function() {
        var previous = scope.month.clone();
        _removeTime(previous.month(previous.month()-1).date(1));
        scope.month.month(scope.month.month()-1);
        _buildMonth(scope, previous, scope.month);
      };
    }
  };

  function _removeTime(date) {
    return date.day(0).hour(0).minute(0).second(0).millisecond(0);
  }

  function _buildMonth(scope, start, month) {
    scope.weeks = [];
    var done = false, date = start.clone(), monthIndex = date.month(), count = 0;
    while (!done) {
	    scope.weeks.push({ days: _buildWeek(date.clone(), month) });
	    date.add(1, "w");
	    done = count++ > 2 && monthIndex !== date.month();
	    monthIndex = date.month();
    }
  }

  function _buildWeek(date, month) {
    var days = [];
    for (var i = 0; i < 7; i++) {
      days.push({
        name: date.format("dd").substring(0, 1),
        number: date.date(),
        isCurrentMonth: date.month() === month.month(),
        isToday: date.isSame(new Date(), "day"),
        date: date
      });
      date = date.clone();
      date.add(1, "d");
    }
    return days;
  }
})
// 地址栏改变成功后自动回顶部
.run(["$rootScope", "$window", "$anchorScroll" , function ($rootScope, $window ,$anchorScroll) {
  $rootScope.$on("$locationChangeSuccess", function() {
    var scrollTo = function (element, to, duration) {
      if (duration <= 0) return;
      var difference = to - element.scrollTop;
      var perTick = difference / duration * 10;
      setTimeout(function() {
        element.scrollTop = element.scrollTop + perTick;
        if (element.scrollTop == to) return;
        scrollTo(element, to, duration - 10);
      }, 10);
    };
    scrollTo(document.body, 0, 500);
  });
}])
// Tooltip
.directive('tooltip', function() {
  return {
		restrict: 'A',
		link: function($scope, $element, $attrs) {

			// 绑定鼠标移入事件
			$element.bind('mouseover', function() {

				// title == null ,return
				if( !$attrs.title ) return;
				// empty the dom title
				$element.attr('title', '');
				// add tool dom
				angular.element(document.body).append('<span id="tooltip">' + $attrs.title + '</span>');
				// position custom
				var tool_pos = $attrs.toolpos ? $attrs.toolpos : 'center';
				var tool_left = function () {
					switch(tool_pos){
						case 'center':
						  return $element[0].getBoundingClientRect().left + $element[0].offsetWidth / 2 - document.getElementById('tooltip').offsetWidth / 2 + 'px';
						  break;
						case 'left':
						  return $element[0].getBoundingClientRect().left - document.getElementById('tooltip').offsetWidth / 2 + 'px';
						  break;
						case 'right':
						  return $element[0].getBoundingClientRect().left + $element[0].offsetWidth - document.getElementById('tooltip').offsetWidth / 2 + 'px';
						  break;
						default:
						  return $element[0].getBoundingClientRect().left + $element[0].offsetWidth / 2 - document.getElementById('tooltip').offsetWidth / 2 + 'px';
					}
				};
				// add fixed css
				angular.element(document.getElementById('tooltip')).css('left', tool_left());
				angular.element(document.getElementById('tooltip')).css('top', $element[0].getBoundingClientRect().top - 8 + 'px');
	    });

	    // 鼠标移除事件
	    $element.bind('mouseout', function() {

	    	// delete tool dom
	    	angular.element(document.getElementById('tooltip')).remove();
	    	// recovery dom title
	    	$element.attr('title', $attrs.title);
	    });
		}
  };
})

// 禁用右键菜单
// window.onload = function () {
// 	document.oncontextmenu = function () {
// 		return false;
// 	}
// }