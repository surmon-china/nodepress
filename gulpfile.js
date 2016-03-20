// 引入 gulp及组件
var gulp      = require('gulp'),                       //基础库
    less      = require('gulp-less'),                 //less
    minifycss = require('gulp-minify-css'),          //css压缩
    uglify    = require('gulp-uglify'),            //js压缩
    rename    = require('gulp-rename'),           //重命名
    concat    = require('gulp-concat'),          //合并文件
    clean     = require('gulp-clean'),         //清空文件夹
    notify    = require("gulp-notify"),       //消息提醒
    sourcemaps= require("gulp-sourcemaps");  //资源地图

// 后台less合并压缩
gulp.task('admin_css', function () {

  var css_src = './np-admin/style.less';
  var css_dst = './np-admin/';

  console.log('开始处理后台Less文件编译');

  gulp.src(css_src)
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(css_dst))
    .pipe(rename({ basename: 'style' }))
    .pipe(gulp.dest(css_dst))
    .pipe(minifycss())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(css_dst))
    .pipe(notify({ message: 'Admin-Less文件编译完成' }))
  
});

// Surmon主题less合并压缩
gulp.task('surmon_css', function () {

  var css_src = './np-themes/Surmon/style.less';
  var css_dst = './np-themes/Surmon/';

  console.log('开始处理后台Less文件编译');

  gulp.src(css_src)
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(css_dst))
    .pipe(rename({ basename: 'style' }))
    .pipe(gulp.dest(css_dst))
    .pipe(minifycss())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(css_dst))
    .pipe(notify({ message: 'Surmon-Less文件编译完成' }))
  
});

// One主题less合并压缩
gulp.task('one_css', function () {

  var css_src = './np-themes/One/style.less';
  var css_dst = './np-themes/One/';

  console.log('开始处理后台Less文件编译');

  gulp.src(css_src)
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(css_dst))
    .pipe(rename({ basename: 'style' }))
    .pipe(gulp.dest(css_dst))
    .pipe(minifycss())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(css_dst))
    .pipe(notify({ message: 'One-Less文件编译完成' }))
  
});

// Rose主题less合并压缩
gulp.task('rose_css', function () {

  var css_src = './np-themes/Rose/style.less';
  var css_dst = './np-themes/Rose/';

  console.log('开始处理后台Less文件编译');

  gulp.src(css_src)
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(css_dst))
    .pipe(rename({ basename: 'style' }))
    .pipe(gulp.dest(css_dst))
    .pipe(minifycss())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(css_dst))
    .pipe(notify({ message: 'Rose-Less文件编译完成' }))
  
});

// 监听任务 运行语句 gulp watch
gulp.task('watch',function(){

  console.log('开始启用NorePress项目Gulp监听服务');

  // 监听后台less
  gulp.watch('./np-admin/style.less', function(){
    console.log('监听到后端-less文件发生变动');
    gulp.start('admin_css');
  });

  // 监听前端Surmon-less
  gulp.watch('./np-themes/Surmon/style.less', function(){
    console.log('监听到前端-less文件发生变动');
    gulp.start('surmon_css');
  });

  // 监听前端Surmon-less
  gulp.watch('./np-themes/One/style.less', function(){
    console.log('监听到前端-less文件发生变动');
    gulp.start('one_css');
  });

  // 监听前端Surmon-less
  gulp.watch('./np-themes/Rose/style.less', function(){
    console.log('监听到前端-less文件发生变动');
    gulp.start('rose_css');
  });

});

// 默认任务/启动监听
gulp.task('default', ['watch']);