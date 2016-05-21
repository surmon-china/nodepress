angular.module('AppRoutes',[]).config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$locationProvider',
  function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {

    // 404路径，跳转至首页
    $urlRouterProvider.otherwise('/');

    // 配置路由
    $stateProvider

      // 首页
      .state('index', {
        url: '/',
        templateUrl: '/partials/home/index/index.html',
        controller: 'IndexController',
        data: {
          title: '首页',
          url: '/'
        }
      })

      // UI-Demo
      .state('ui', {
        url: '/ui',
        templateUrl: '/partials/home/index/ui.html',
        controller: 'IndexController',
        data: {
          title: 'UI',
          url: ''
        }
      })

      // Mobile
      .state('mobile', {
        url: '/mobile',
        templateUrl: '/partials/home/index/mobile.html',
        controller: 'IndexController',
        data: {
          title: 'APP客户端下载',
          url: ''
        }
      })

      // --------------------------------

      // 授权模块
      .state('auth', {
        abstract: true,
        url: '/auth',
        template: '<div ui-view></div>',
        controller: 'AuthController',
        data: {
          title: '授权模块',
          url: '/auth',
        }
      })

      // 用户登录
      .state('auth.login', {
        url: '/login',
        templateUrl: '/partials/home/auth/login.html',
        controller: 'AuthController',
        data: {
          title: '用户登录',
          url: '/auth/login'
        }
      })

      // 用户注册
      .state('auth.register', {
        url: '/register',
        templateUrl: '/partials/home/auth/register.html',
        controller: 'AuthController',
        data: {
          title: '用户注册',
          url: '/auth/register'
        }
      })

      // 公益用户登录
      .state('auth.login_welfare', {
        url: '/login/welfare',
        templateUrl: '/partials/home/auth/welfare.html',
        controller: 'AuthController',
        data: {
          title: '公益用户登录',
          url: '/auth/login/welfare'
        }
      })

      // 找回密码
      .state('auth.forgot', {
        url: '/forgot',
        templateUrl: '/partials/home/auth/forgot.html',
        controller: 'AuthController',
        data: {
          title: '找回密码',
          url: '/auth/login/forgot'
        }
      })

      // 账户绑定
      .state('auth.bind', {
        url: '/bind',
        templateUrl: '/partials/home/auth/bind.html',
        controller: 'AuthController',
        data: {
          title: '账户绑定',
          url: '/auth/bind'
        }
      })

      // --------------------------------

      // 注册协议页
      .state('article_license', {
        url: '/article/license',
        templateUrl: '/partials/home/article/license.html',
        controller: 'ArticleController',
        data: {
          title: '学天下注册协议',
          url: '/article/license',
          slug: ''
        }
      })

      // 文章页
      .state('article', {
        url: '/article/list/:category_id',
        templateUrl: '/partials/home/article/index.html',
        controller: 'ArticleController',
        data: {
          title: '文章列表',
          url: '',
          slug: ''
        }
      })
      
      // --------------------------------

      // 课程
      .state('course', {
        url: '/course',
        templateUrl: '/partials/home/course/lists.html',
        controller: 'CourseController',
        data: {
          title: '课程列表',
          url: '/course'
        }
      })

      // 课程搜索（无关键词）
      .state('course_search_error', {
        url: '/course/search',
        templateUrl: '/partials/home/course/lists.html',
        controller: 'CourseController',
        data: {
          title: '课程列表',
          url: ''
        }
      })

      // 课程搜索分类
      .state('course_search', {
        url: '/course/search/:key',
        templateUrl: '/partials/home/course/lists.html',
        controller: 'CourseController',
        data: {
          title: '课程搜索',
          url: ''
        }
      })

      // 课程分类
      .state('course_list', {
        url: '/course/list/:category_id',
        templateUrl: '/partials/home/course/lists.html',
        controller: 'CourseController',
        data: {
          title: '课程分类',
          url: ''
        }
      })

      // 课程详情
      .state('course_detail', {
        url: '/course/:course_id',
        templateUrl: '/partials/home/course/detail.html',
        controller: 'CourseController',
        data: {
          title: '课程详情',
          url: ''
        }
      })

      // 课程播放
      .state('course_learn', {
        url: '/course/:course_id/learn/:section_id',
        templateUrl: '/partials/home/course/learn.html',
        controller: 'CourseController',
        data: {
          title: '课程播放',
          url: ''
        }
      })

      // 课程播放（定点）
      .state('course_learn_from_record', {
        url: '/course/:course_id/learn/:section_id/:record_time',
        templateUrl: '/partials/home/course/learn.html',
        controller: 'CourseController',
        data: {
          title: '课程播放',
          url: ''
        }
      })

      // 课程购买
      .state('course_buy', {
        url: '/course/:course_id/buy',
        templateUrl: '/partials/home/course/detail.html',
        controller: 'CourseController',
        data: {
          title: '课程购买',
          url: ''
        }
      })

      // 支付失败
      .state('payment_error', {
        url: '/payment/error',
        templateUrl: '/partials/home/course/buy-error.html',
        controller: 'PaymentController',
        data: {
          title: '支付失败',
          url: '/payment/error'
        }
      })

      // 支付课程
      .state('payment', {
        url: '/payment/:course_ids',
        templateUrl: '/partials/home/course/payment.html',
        controller: 'PaymentController',
        data: {
          title: '课程支付',
          url: ''
        }
      })

      // 支付成功
      .state('payment_success', {
        url: '/payment/:course_ids/success',
        templateUrl: '/partials/home/course/buy-success.html',
        controller: 'PaymentController',
        data: {
          title: '支付成功',
          url: '/payment/success'
        }
      })

      // --------------------------------

      // 学校/机构列表页（简易）
      .state('organization_list', {
        url: '/organization',
        templateUrl: '/partials/home/organization/list.html',
        controller: 'OrganizationlController',
        data: {
          title: '学校列表'
        }
      })

      // 学校/机构列表页（搜索空白）
      .state('organization_search_error', {
        url: '/organization/search',
        templateUrl: '/partials/home/organization/list.html',
        controller: 'OrganizationlController',
        data: {
          title: '学校列表'
        }
      })

      // 学校/机构列表页（搜索）
      .state('organization_search', {
        url: '/organization/search/:key',
        templateUrl: '/partials/home/organization/search.html',
        controller: 'OrganizationlController',
        data: {
          title: '学校列表'
        }
      })

      // 学校/机构主页
      .state('organization', {
        url: '/organization/:organization_id',
        templateUrl: '/partials/home/organization/index.html',
        controller: 'OrganizationlController',
        data: {
          title: '机构主页'
        }
      })

      // --------------------------------

      // 学生主页
      .state('student_index', {
        url: '/space/student/:student_id',
        templateUrl: '/partials/home/student/index.html',
        controller: 'StudentController',
        data: {
          title: '学生主页',
          url: ''
        }
      })

      // 老师主页
      .state('teacher_index', {
        url: '/organization/:organization_id/teacher/:teacher_id',
        templateUrl: '/partials/home/organization/teacher.html',
        controller: 'OrganizationlController',
        data: {
          title: '老师主页',
          url: ''
        }
      })

      // --------------------------------

      // 用户中心
      .state('user', {
        abstract: true,
        url: '/user',
        templateUrl: '/partials/home/user/sidebar.html',
        controller: 'UserController',
        data: {
          title: '个人中心',
          url: '/user/index'
        }
      })

      // 首页
      .state('user.index', {
        url: '/index',
        templateUrl: '/partials/home/user/index.html',
        controller: 'UserController',
        data: {
          title: '',
          url: '',
          slug: 'index'
        }
      })

      // 我的课程
      .state('user.course', {
        url: '/course',
        templateUrl: '/partials/home/user/course.html',
        controller: 'UserController',
        data: {
          title: '我的课程',
          url: '',
          slug: 'course'
        }
      })

      // 学习记录
      .state('user.history', {
        url: '/history',
        templateUrl: '/partials/home/user/history.html',
        controller: 'UserController',
        data: {
          title: '学习记录',
          url: '',
          slug: 'history'
        }
      })

      // 我的收藏
      .state('user.favorite', {
        url: '/favorite',
        templateUrl: '/partials/home/user/favorite.html',
        controller: 'UserController',
        data: {
          title: '我的收藏',
          url: '',
          slug: 'favorite'
        }
      })

      // 我的问答
      .state('user.question', {
        url: '/question',
        templateUrl: '/partials/home/user/question/list.html',
        controller: 'UserController',
        data: {
          title: '我的问答',
          url: '',
          slug: 'question'
        }
      })

      // 问答详情
      .state('user.question_detail', {
        url: '/question/:question_id',
        templateUrl: '/partials/home/user/question/detail.html',
        controller: 'UserController',
        data: {
          title: '问答详情',
          url: '',
          slug: 'question'
        }
      })

      // 我的笔记
      .state('user.note', {
        url: '/note',
        templateUrl: '/partials/home/user/note/list.html',
        controller: 'UserController',
        data: {
          title: '我的笔记',
          url: '',
          slug: 'note'
        }
      })

      // 个人资料
      .state('user.profile', {
        url: '/profile',
        templateUrl: '/partials/home/user/profile.html',
        controller: 'UserController',
        data: {
          title: '个人资料',
          url: '',
          slug: 'profile'
        }
      })

      // 修改密码
      .state('user.password', {
        url: '/password',
        templateUrl: '/partials/home/user/password.html',
        controller: 'UserController',
        data: {
          title: '修改密码',
          url: '',
          slug: 'password'
        }
      })

      // 账户绑定
      .state('user.account', {
        url: '/account',
        templateUrl: '/partials/home/user/account.html',
        controller: 'AuthController',
        data: {
          title: '账户绑定',
          url: '',
          slug: 'account'
        }
      })

      // 账单明细
      .state('user.bill', {
        url: '/bill',
        templateUrl: '/partials/home/user/bill.html',
        controller: 'UserController',
        data: {
          title: '账单明细',
          url: '',
          slug: 'bill'
        }
      })

      // 积分明细
      .state('user.score', {
        url: '/score',
        templateUrl: '/partials/home/user/score.html',
        controller: 'UserController',
        data: {
          title: '积分明细',
          url: '',
          slug: 'score'
        }
      })

      // 通知中心
      .state('user.msg', {
        url: '/msg',
        templateUrl: '/partials/home/user/msg.html',
        controller: 'UserController',
        data: {
          title: '通知中心',
          url: '',
          slug: 'msg'
        }
      })

      // 勋章中心
      .state('user.medal', {
        url: '/medal',
        templateUrl: '/partials/home/user/medal.html',
        controller: 'UserController',
        data: {
          title: '勋章中心',
          url: '',
          slug: 'medal'
        }
      })

      // 优惠卡券
      .state('user.coupons', {
        url: '/coupons',
        templateUrl: '/partials/home/user/coupons.html',
        controller: 'UserController',
        data: {
          title: '我的卡券',
          url: '',
          slug: 'coupons'
        }
      })

      // --------------------------------

      // 教师中心
      .state('teacher', {
        abstract: true,
        url: '/teacher',
        templateUrl: '/partials/home/teacher/sidebar.html',
        controller: 'TeacherController',
        data: {
          title: '教师中心',
          url: '/teacher/index',
          slug: 'index'
        }
      })

      // 教师主页
      .state('teacher.index', {
        url: '/index',
        templateUrl: '/partials/home/teacher/index.html',
        controller: 'TeacherController',
        data: {
          title: '',
          url: '',
          slug: 'index'
        }
      })

      // 已售课程
      .state('teacher.trade', {
        url: '/trade',
        templateUrl: '/partials/home/teacher/trade.html',
        controller: 'TeacherController',
        data: {
          title: '已售课程',
          url: '/teacher/trade',
          slug: 'trade'
        }
      })

      // 评价管理
      .state('teacher.rate', {
        url: '/rate',
        templateUrl: '/partials/home/teacher/rate/list.html',
        controller: 'TeacherController',
        data: {
          title: '评价管理',
          url: '/teacher/rate',
          slug: 'rate'
        }
      })

      // 我的课程（中继）
      .state('teacher.course', {
        abstract: true,
        url: '/course',
        template: '<div class="box lesson slide-top" ui-view></div>',
        controller: 'LessonController',
        data: {
          title: '我的课程',
          url: '/teacher/course/list',
          slug: 'course'
        }
      })

      // 已开课程
      .state('teacher.course.list', {
        url: '/list',
        templateUrl: '/partials/home/teacher/course/course-list.html',
        controller: 'LessonController',
        data: {
          title: '已开课程',
          url: '',
          slug: 'course'
        }
      })

      // 发布课程
      .state('teacher.course.add', {
        url: '/add',
        templateUrl: '/partials/home/teacher/course/course-edit.html',
        controller: 'LessonController',
        data: {
          title: '发布课程',
          url: '',
          slug: 'course-add'
        }
      })

      // 编辑课程
      .state('teacher.course.edit', {
        url: '/edit/:course_id',
        templateUrl: '/partials/home/teacher/course/course-edit.html',
        controller: 'LessonController',
        data: {
          title: '编辑课程',
          url: '',
          slug: 'course'
        }
      })

      // 编辑章节
      .state('teacher.course.section_edit', {
        url: '/section/edit/:course_id',
        templateUrl: '/partials/home/teacher/course/section-edit.html',
        controller: 'LessonController',
        data: {
          title: '编辑章节',
          url: '',
          slug: 'course'
        }
      })

      // 我的学校（中继）
      .state('teacher.organization', {
        abstract: true,
        url: '/organization',
        template: '<div class="box organization slide-top" ui-view></div>',
        controller: 'SchoolController',
        data: {
          title: '我的学校',
          url: '/teacher/organization/list',
          slug: 'organization'
        }
      })

      // 个人中心-我的学校
      .state('teacher.organization.list', {
        url: '/list',
        templateUrl: '/partials/home/teacher/organization/list.html',
        controller: 'SchoolController',
        data: {
          title: '',
          url: '/teacher/organization/index',
          slug: 'organization'
        }
      })

      // 个人中心-搜索学校
      .state('teacher.organization.search', {
        url: '/search',
        templateUrl: '/partials/home/teacher/organization/search.html',
        controller: 'SchoolController',
        data: {
          title: '搜索学校',
          url: ''
        } 
      })

      // 个人中心-创建学校
      .state('teacher.organization.add', {
        url: '/add',
        templateUrl: '/partials/home/teacher/organization/add.html',
        controller: 'SchoolController',
        data: {
          title: '创建学校',
          url: ''
        } 
      })

      // 个人中心-加入学校
      .state('teacher.organization.join', {
        url: '/join/:organization_id',
        templateUrl: '/partials/home/teacher/organization/join.html',
        controller: 'SchoolController',
        data: {
          title: '加入学校',
          url: ''
        } 
      })

      // 个人中心-学校管理
      .state('teacher.organization.manage', {
        url: '/manage/:organization_id',
        templateUrl: '/partials/home/teacher/organization/manage.html',
        controller: 'SchoolController',
        data: {
          title: '学校管理',
          url: ''
        } 
      })

      // 我的收入，抽象继承
      .state('teacher.income', {
        abstract: true,
        url: '/income',
        template: '<div class="income box slide-top" ui-view></div>',
        controller: 'IncomeController',
        data: {
          title: '我的收入',
          url: '/teacher/income/index',
          slug: 'income'
        }
      })

      // 我的收入
      .state('teacher.income.index', {
        url: '/index',
        templateUrl: '/partials/home/teacher/income/index.html',
        controller: 'IncomeController',
        data: {
          title: '',
          url: '',
          slug: 'income'
        }
      })

      // 收入明细
      .state('teacher.income.details', {
        url: '/details',
        templateUrl: '/partials/home/teacher/income/details.html',
        controller: 'IncomeController',
        data: {
          title: '收入明细',
          url: ''
        }
      })

      // 申请提现
      .state('teacher.income.apply', {
        url: '/apply',
        templateUrl: '/partials/home/teacher/income/apply.html',
        controller: 'IncomeController',
        data: {
          title: '申请提现',
          url: '',
          slug: 'apply'
        }
      })

      // 提现记录
      .state('teacher.income.record', {
        url: '/record',
        templateUrl: '/partials/home/teacher/income/record.html',
        controller: 'IncomeController',
        data: {
          title: '提现记录',
          url: ''
        }
      })

      // 管理提现账户
      .state('teacher.income.account_list', {
        url: '/account-list',
        templateUrl: '/partials/home/teacher/income/account-list.html',
        controller: 'IncomeController',
        data: {
          title: '管理账户',
          url: ''
        }
      })

      // 添加提现账户
      .state('teacher.income.account_add', {
        url: '/account-add',
        templateUrl: '/partials/home/teacher/income/account-add.html',
        controller: 'IncomeController',
        data: {
          title: '添加账户',
          url: ''
        }
      })

      // 个人资料
      .state('teacher.profile', {
        url: '/profile',
        templateUrl: '/partials/home/user/profile.html',
        controller: 'UserController',
        data: {
          title: '个人资料',
          url: '',
          slug: 'profile'
        }
      })

      // 修改密码
      .state('teacher.password', {
        url: '/password',
        templateUrl: '/partials/home/user/password.html',
        controller: 'UserController',
        data: {
          title: '修改密码',
          url: '',
          slug: 'password'
        }
      })

      // 账户绑定
      .state('teacher.account', {
        url: '/account',
        templateUrl: '/partials/home/user/account.html',
        controller: 'AuthController',
        data: {
          title: '账户绑定',
          url: '',
          slug: 'account'
        }
      })

      $locationProvider.html5Mode(true);

      // 拦截器
      $httpProvider.interceptors.push(['$rootScope', '$q', '$localStorage', function ($rootScope, $q, $localStorage) {
        return {
          request: function (config) {

            // 请求站内资源时，带上token
            if (!config.url.contain('http://up.qiniu.com')) {
              config.headers = config.headers || {};
              if ($localStorage.token) {
                config.headers.Authorization = 'Bearer ' + $localStorage.token;
              };
            };

            // 定义需要排除Loading动画的url关键字
            var exclude_api = ['unread_count', 'follow', 'record'];

            // 每次请求时开启loading动画（同时排除部分api）
            (function () {
              for (var i = 0; i < exclude_api.length; i++) {
                if (config.url.indexOf(exclude_api[i]) > -1) {
                  // $rootScope.modal.closeLoading();
                }
              }
            })();

            // 每次发出请求执行token的时效性检查，保证处于最佳状态
            $rootScope.updateToken();
            
            return config;
          },
          response: function (response) {
            return $q.when(response);
          },

          responseError: function (response) {

            // 发生错误时，关闭动画
            $rootScope.modal.closeLoading();
            
            switch (response.status) {
              case 401:
                  // $rootScope.modal.error({ message: '401 ERROR!' });
                  // $location.path('/login');
                  break;
              case 403:
                  $rootScope.modal.error({ message: '403! 无权访问API' });
                  // $location.path('/index');
                  break;
              case 404:
                  // $rootScope.modal.error({ message: '404 ERROR!' });
                  break;
              case 422:
                  // $rootScope.modal.error({ message: '422 ERROR!', message: response.message });
                  break;
              case 500:
                  $rootScope.modal.error({ message: '500 ERROR!' });
                  break;
               default:
                  break;
            }
            
            return $q.reject(response);
          }
        }
      }
    ])
  }
]);