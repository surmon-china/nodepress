JOSN API 主要API接口（全部GET）：

## 1：基础API

	site.domain/api

## 2：分页查询

	查询参数中组合 &page=1

## 3：文章队列

	最新全部文章：
	site.domain/api/get_recent_posts/

	分类文章：
	site.domain/api/get_category_posts/?slug=分类别名

	标签文章：
	site.domain/api/get_tag_posts/?slug=标签别名

	搜索文章：
	site.domain/api/get_search_results/?search=关键词

	作者文章：
	site.domain/api/get_author_posts/?slug=作者别名

	日期文章（格式：'YYYY' or 'YYYY-MM' or 'YYYY-MM-DD'）：
	site.domain/api/get_date_posts/?date=2015-03-19


	包含：全部文章数、全部页数

	列表队列包含：

	ID、类型、名称、内容、描述、日期、所在分类（名称）、所在标签（名称）、作者（名称、ID）、评论内容及数量
	不同版本缩略图、浏览次数、

## 4：所有标签数据（用于Aside）

	site.domain/api/get_tag_index/

## 5：获取文章内容页

	site.domain/api/get_post/?id=文章ID

## 6：获取独立页面（包含内容和评论）

	site.domain/api/get_page/?slug=guestbook

## 7：


--------------------------------------------------------


WP REST API 主要API接口(GET)：


## 1：基础API

	site.domain/wp-json/wp/v2


## 2：导航菜单

	获取函数中注册的导航菜单：

	site.domain/wp-json/wp-api-menus/v2/menu-locations/nav

	"nav"为注册时的唯一标示符


## 3：最新文章列表（根据后台设置【阅读】中的数量决定）

	包含：
	文章ID、
	时间、
	标题、类型、
	静态地址、
	内容、
	描述、
	作者ID、
	特色图像ID、
	评论状态、
	是否置顶，
	内容页接口，
	作者接口，
	编辑历史，


	缺少：
	作者名称和链接信息，
	浏览次数，
	评论数，
	所属分类，
	所属标签，
	特色图像地址，


	site.domain/wp-json/wp/v2/posts


## 4：分页查询

	最新文章
	site.domain/wp-json/wp/v2/posts?page=3

	分类列表查询


	标签列表查询

	作者作品列表查询

## 5：文章过滤器：

	格式：site.domain/wp-json/wp/v2/posts ?filter[key]=value

	搜索：site.domain/wp-json/wp/v2/posts ?filter[s]=Javascript

	数量：site.domain/wp-json/wp/v2/posts ?filter[posts_per_page]=8

	搜索+数量（8篇javascipt的结果页的文章）：

	site.domain/wp-json/wp/v2/posts ?filter[posts_per_page]=8&filter[s]=Javascript

	搜索+数量+分页查询（搜索结果显示8篇，并且定位到第四页）

	http://localhost/wp-json/wp/v2/posts?filter[posts_per_page]=8&filter[s]=Javascript&page=4



header区域加载完数据后保存在内存中，
当页面切换到music播放器页面时会使用内存中的数据，而不是重新请求
这样当网站打开时，即开始请求数据，数据请求成功后保存到内存中

问题：页面切换到music时会自动，创建audio对象，实例化控制器对象，执行一切方法，

需求：需要两者均加载控制器，且数据同步，任意一个操作均同步至另一个操作

解决方案：两者均读取和操作rootscope中的数据和方法，而不是直接控制音乐控制器