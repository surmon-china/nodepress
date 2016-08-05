<template>
  <!-- <div class="article-lists" :class="{ loading: !items.length }">
    <item
      v-for="item in items"
      :item="item"
      :index="$index | formatItemIndex"
      track-by="id">
    </item>

    <div class="nav" v-show="items.length > 0">
      <a v-if="page > 1" :href="'#/news/' + (page - 1)">上一篇</a>
      <a v-if="page < 4" :href="'#/news/' + (page + 1)">更多...</a>
    </div>
  </div> -->
  <div>文章列表页</div>
</template>

<script>

// 引入其他模块
import Item from './Item.vue'

// 定义模块
export default {

  // 组件（模块）名称
  name: 'ArticleView',

  // 依赖组件
  components: {
    Item
  },

  // 绑定的数据
  data () {
    return {
      page: 1,
      items: []
    }
  },

  // 本View下的子路由
  route: {
    data ({ to }) {
      // const page = +to.params.page
      // document.title = 'Vue.js HN Clone'
      // return store.fetchItemsByPage(page).then(items => ({
      //   page,
      //   items
      // }))
    }
  },

  // 被创建时func
  created () {
    // store.on('topstories-updated', this.update)
  },

  // 被销毁时func
  destroyed () {
    // store.removeListener('topstories-updated', this.update)
  },

  // 包含方法
  methods: {
    update () {
      // 通过fetch获取资源
      // store.fetchItemsByPage(this.page).then(items => {
      //   this.items = items
      // })
    }
  },

  // view私有过滤器
  filters: {
    formatItemIndex (index) {
      return (this.page - 1) * store.storiesPerPage + index + 1
    }
  }
}
</script>

<style lang="stylus">
</style>
