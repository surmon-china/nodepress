/**
 * @author Surmon(surmon.me)
 * 为实现全局播放器，将所有逻辑封装至rootscope的musicPlayer对象中，包括audio对象，在调用的地方完全使用rootscope子对象的调用方式调用
 * 数据操作均在rootscope中，此文件仅为逻辑清晰而分离使用，无逻辑模块化意义
 */
(function() {

  // 使用严格模式
  "use strict";

  // 声明模块
  var musicPlayer = angular.module('angular-music-player', ['ngSanitize']);

  // 主程序方法/判断UA拒绝IE访问
  musicPlayer.run(function() {
    if (navigator.appVersion.indexOf('MSIE') != -1) {
      document.write('本程序不支持IE浏览器。');
    }
  });

  // 使用工厂模式定义请求监听器
  musicPlayer.factory('RequestInjector', ["$rootScope", function ($rootScope) {
   return {
      request: function (config) {
        // console.log($rootScope);
        return config;
      },
      response: function (response) {
        return response;
      }
    }
  }]);

  // 添加路由监听
  musicPlayer.config(['$httpProvider', function($httpProvider){

    // 添加路由请求监听
    // $httpProvider.interceptors.push('RequestInjector');
  }]);

  // 根父控制器
  musicPlayer.controller('Music', ['$rootScope', '$http', '$timeout', function( $rootScope, $http, $timeout) {

    // 初始化播放器
    if ($rootScope.musicPlayer) {
      console.log('播放器已初始化，停止返回');
      return false;
    };
    $rootScope.musicPlayer = {};
    $rootScope.musicPlayer.audio = new Audio();
    $rootScope.musicPlayer.audio.loop = false;
    $rootScope.musicPlayer.audio.muted = false;
    $rootScope.musicPlayer.audio.volume = 0.6;
    $rootScope.musicPlayer.audio.autoplay = true;
    $rootScope.musicPlayer.volume = 60;
    $rootScope.musicPlayer.playing = false;
    $rootScope.musicPlayer.list_loop = true;
    $rootScope.musicPlayer.progress = 0;
    $rootScope.musicPlayer.progress_pause = false;
    $rootScope.musicPlayer.album = {};
    $rootScope.musicPlayer.song = {};
    $rootScope.musicPlayer.song.song_index = 0;

    // 加载效果
    $rootScope.$on('loading', function(e, text) {
      $rootScope.musicPlayer.loading = true;
    });
    
    // 监听播放模式的改变
    $rootScope.$watch('musicPlayer.list_loop', function(newVal, oldVal) {
      console.log('改变了播放模式：从' +　oldVal + '到' + newVal);
      $rootScope.musicPlayer.audio.loop = !$rootScope.musicPlayer.list_loop;
    });

    // 监听音量的改变
    $rootScope.$watch('musicPlayer.volume', function(newVol, oldVol) {
      // console.log('改变了音量：从' + oldVol + '到' + newVol);
      $rootScope.musicPlayer.audio.volume = newVol / 100;
    });

    // 监听播放器播放
    $rootScope.musicPlayer.audio.addEventListener('play', function() {
      $rootScope.$apply(function() {
        console.log('播放器开始播放');
        $rootScope.musicPlayer.playing = true;
      });
    }, false);

    // 监听暂停动作
    $rootScope.musicPlayer.audio.addEventListener('pause', function() {
      $rootScope.$apply(function() {
        console.log('播放器暂停');
        $rootScope.musicPlayer.playing = false;
      });
    }, false);

    // 监听停止动作
    $rootScope.musicPlayer.audio.addEventListener('ended', function() {
      console.log('播放停止，下一首');
      $rootScope.musicPlayer.next();
    }, false);

    // 监听播放时间更新
    $rootScope.musicPlayer.audio.addEventListener('timeupdate', function(element) {
      // console.log('实时的播放时间在变化');
      // console.log(element.target.currentTime);
      // 处理歌词的显示
      // console.log('处理歌词的显示，以及进度条的变化');
      // console.log($rootScope.musicPlayer.song);
      $rootScope.$apply(function() {
        $rootScope.musicPlayer.song.song_current_time = element.target.currentTime;
        if (!$rootScope.musicPlayer.progress_pause) {
          $rootScope.musicPlayer.progress = $rootScope.musicPlayer.song.song_current_time / $rootScope.musicPlayer.song.song_duration * 1000000;
        }
      });
    });

    // 载入歌曲逻辑
    $rootScope.musicPlayer.load = function(song_index, song_id) {
      console.log('执行载入');
      console.log(song_index + song_id);
      console.log($rootScope.musicPlayer.song);

      // 如果所点击的歌曲不是当前所播放的歌曲则开始请求并载入新歌曲
      if (song_id && song_id != $rootScope.musicPlayer.song.song_id) {

        // 预置同步信息至当前播放音乐
        $rootScope.musicPlayer.song = $rootScope.musicPlayer.songs[song_index];
        $rootScope.musicPlayer.song.song_duration = $rootScope.musicPlayer.songs[song_index].song_duration / 1000;
        // 驱动播放器
        $rootScope.musicPlayer.audio.src = $rootScope.musicPlayer.songs[song_index].song_src;
        console.log('载入歌曲完成');
        $rootScope.musicPlayer.song = $rootScope.musicPlayer.songs[song_index];
        $rootScope.musicPlayer.song.song_index = song_index;
        // 播放
        $rootScope.musicPlayer.play();
        // 请求音乐的详细信息
        $rootScope.musicPlayer.getMusicSongInfo(song_index, song_id);
      }
    };

    // 播放歌曲
    $rootScope.musicPlayer.play = function () {
      console.log('播放');
      $rootScope.musicPlayer.audio.play();
    };

    // 暂停歌曲
    $rootScope.musicPlayer.pause = function () {
      $rootScope.musicPlayer.audio.pause();
    };

    // 播放/暂停切换
    $rootScope.musicPlayer.toggle = function () {
      if ($rootScope.musicPlayer.playing) {
        $rootScope.musicPlayer.pause();
      } else {
        $rootScope.musicPlayer.play();
      }
    }

    // 切换
    $rootScope.musicPlayer.prev = function() {
      console.log('上一首');
      var prev_index;
      if ($rootScope.musicPlayer.song.song_index == 0) {
        prev_index = $rootScope.musicPlayer.songs.length - 1;
      } else {
        prev_index = $rootScope.musicPlayer.song.song_index - 1;
      }
      var prev_id = $rootScope.musicPlayer.songs[prev_index].song_id;

      console.log($rootScope.musicPlayer.song);
      console.log(prev_index);
      
      $rootScope.musicPlayer.load(prev_index, prev_id);
    };

    $rootScope.musicPlayer.next = function() {
      var next_index = $rootScope.musicPlayer.song.song_index + 1;
      // 如果有下一首，则播放下一首，否则弹出提示
      if ($rootScope.musicPlayer.songs[next_index]) {
        var next_id = $rootScope.musicPlayer.songs[next_index].song_id;
        $rootScope.musicPlayer.load(next_index, next_id);
      } else {
        $rootScope.musicPlayer.load(0, $rootScope.musicPlayer.songs[0].song_id);
      }
    };

    // 跳转到指定进度位置逻辑
    $rootScope.musicPlayer.seekTo = function () {
      $rootScope.musicPlayer.audio.currentTime = $rootScope.musicPlayer.song.song_duration * $rootScope.musicPlayer.progress / 1000000;
      $rootScope.musicPlayer.progress_pause = false;
    }

     // 根据用户ID请求音乐专辑列表信息
    $rootScope.musicPlayer.getMusicAlbumList = function () {
      $http({
        url: $rootScope.blogInfo.url + '/wp-admin/admin-ajax.php',
        method:'GET',
        params: { action: 'get_music_album_list' }
      }).success(function(data,header,config,status){
        console.log('已请求到后台的音乐专辑列表数据');
        // 请求到专辑列表后同步至model，并请求[收藏列表]的音乐列表
        $rootScope.musicPlayer.albumList = data.album_list;
        $rootScope.musicPlayer.getMusicSongsList(data.favorite_list.playlist_id);
      }).error(function(){
        alert('专辑列表信息请求失败');
      });
    };

    // 根据专辑id请求歌曲列表
    $rootScope.musicPlayer.getMusicSongsList = function (album_id) {
      $http({
        url: $rootScope.blogInfo.url + '/wp-admin/admin-ajax.php',
        method:'GET',
        params: { action: 'get_music_playlist_list', album_id: album_id }
      }).success(function(data,header,config,status){
        console.log('已请求到后台的音乐id为'+ album_id +'的专辑的歌曲列表数据');
        // 同步至model，并且开始播放第一首音乐
        $rootScope.musicPlayer.album = data;
        $rootScope.musicPlayer.favoriteList = data;
        $rootScope.musicPlayer.songs = data.songs;
        // 如果主程序设置了自动播放，且此时没有音乐正在播放，则自动播放第一首音乐
        if ($rootScope.blogInfo.musicPlayerAutoPlay && !$rootScope.musicPlayer.song.song_id) {
          console.log('播放第一手');
          $rootScope.musicPlayer.load(0, $rootScope.musicPlayer.songs[0].song_id);
        }
      }).error(function(){
        alert('歌曲列表信息请求失败');
      });
    };

    // 根据歌曲id请求音乐详细数据
    $rootScope.musicPlayer.getMusicSongInfo = function (index, song_id) {
      $http({
        url: $rootScope.blogInfo.url + '/wp-admin/admin-ajax.php',
        method:'GET',
        params: { action: 'get_music_song', song_id: song_id }
      }).success(function(data,header,config,status){
        console.log('已请求到的后台的音乐'+ song_id +'的歌曲详细数据');
        $rootScope.musicPlayer.song = data;
        $rootScope.musicPlayer.song.song_index = index;
        $rootScope.musicPlayer.song.song_duration = $rootScope.musicPlayer.song.song_duration / 1000;
        console.log($rootScope);
      }).error(function(){
        alert('歌曲详情信息请求失败');
      });
    };

    // 播放器自动加载初始化-获取歌单
    if ($rootScope.blogInfo.musicPlayerAutoLoad) {
      $rootScope.musicPlayer.getMusicAlbumList();
    }

    console.log($rootScope.musicPlayer);
    
  }]);

  // 时间格式化
  musicPlayer.filter('formattime', [
    function() {
      return function(input) {
        input = parseInt(input) || 0;
        var min = 0;
        var sec = 0;
        if (input > 60) {
          min = parseInt(input / 60);
          sec = input - 60 * min;
          min = min >= 10 ? min : '0' + min;
          sec = sec >= 10 ? sec : '0' + sec;
        }
        else {
          min = '00';
          sec = input >= 10 ? input : '0' + input;
        }
        return min + ':' + sec;
      }
    }
  ]);

  // dom编译
  musicPlayer.filter('html', [
    '$sce', function($sce) {
      return function(input) {
        return $sce.trustAsHtml(input);
      }
    }
  ]);
})();