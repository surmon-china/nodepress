var mongoose = require('mongoose');

// 设置集合模型
var optionSchema = new mongoose.Schema({

  title: {
    name: '网站标题',
    description: '网站的标题',
    content: 'Nodepress'
  },
  description: {
    name: '网站描述',
    description: '网站的描述',
    content: '基于MEAN结构的博客程序'
  },
  static: {
    name: '统计代码',
    description: '网站的统计代码',
    content: '<script>console.log("static");</script>'
  },

  /*
  password: '用户密码',
  siteurl: 'http://surmon.me/app',
  home: 'http://surmon.me/app',
  blogname: 'surmon_Angular',
  blogdescription: '一个WordPress站点',
  users_can_register: 0,
  admin_email: 'surmon@foxmail.com',
  start_of_week: 1,
  use_balanceTags: 0,
  use_smilies: 1,
  require_name_email: 1,
  comments_notify: 1,
  posts_per_rss: 10,
  rss_use_excerpt: 0,
  mailserver_url: 'mail.example.com',
  mailserver_login: 'login@example.com',
  mailserver_pass: 'password',
  mailserver_port: 110,
  default_category: 1,
  default_comment_status: 'open',
  default_ping_status: 'open',
  default_pingback_flag: ,
  posts_per_page: 10,
  date_format: 'Y年n月j日',
  time_format: ag:i,
  links_updated_date_format: 'Y年n月j日',
  comment_moderation: ,
  moderation_notify: 1,
  permalink_structure: '/%postname%/',
  gzipcompression: 0,
  hack_file: 0,
  blog_charset: 'UTF-8',
  moderation_keys: 2,
  active_plugins: [],
  category_base: ,
  ping_sites: ['http://rpc.pingomatic.com/'],
  advanced_edit: 0,
  comment_max_links: 2,
  gmt_offset: 0,
  default_email_category: 1,
  template: 'Surmon',
  stylesheet: 'Surmon',
  comment_whitelist: 1,
  blacklist_keys: 2,
  comment_registration: ,
  html_type: 'text/html',
  use_trackback: 0,
  default_role: 'subscriber',
  db_version: 33056,
  uploads_use_yearmonth_folders: 1,
  upload_path: ,
  blog_public: 0,
  default_link_category: 2,
  show_on_front: 'posts',
  tag_base: ,
  show_avatars: ,
  Gavatar_rating: ,
  upload_url_path: ,
  thumbnail_size_w: 150,
  thumbnail_size_h: 150,
  thumbnail_crop: 1,
  medium_size_w: 300,
  medium_size_h: 300,
  avatar_default: 'mystery',
  large_size_w: 1024,
  large_size_h: 1024,
  image_default_link_type: 'file',
  image_default_size: 2,
  image_default_align: 3,
  close_comments_for_old_posts: 2,
  close_comments_days_old: 14,
  thread_comments: 1,
  thread_comments_depth: 5,
  page_comments: ,
  comments_per_page: 50,
  default_comments_page: 'newest',
  comment_order: asc,
  sticky_posts: 0,
  uninstall_plugins: {},
  timezone_string: 'Asia/Shanghai',
  page_for_posts: 0,
  page_on_front: 0,
  default_post_format: 0,
  link_manager_enabled: 0,
  finished_splitting_shared_terms: 1
  */

});

// 设置模型
var Option = mongoose.model('Option', optionSchema);

// 模块化
module.exports = Option;