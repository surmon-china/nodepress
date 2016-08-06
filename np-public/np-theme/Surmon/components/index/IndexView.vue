<style lang="stylus" scoped>
</style>

<template>
  <div class="index">

    <!-- 幻灯 -->
    <carrousel-view></carrousel-view>

    <!-- 最新文章列表 -->
    <article-list-view></article-list-view>
    
  </div>
</template>

<script>

  // 依赖组件
  import CarrouselView from './CarrouselView.vue'
  import ArticleListView from '../article/ListView.vue'

  // 模块配置
  export default {

    // 依赖组件
    components: {
      CarrouselView,
      ArticleListView
    }
  }

</script>