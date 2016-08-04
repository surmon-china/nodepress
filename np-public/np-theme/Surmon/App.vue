<!-- 主程序模块 -->
<style lang="sass">
  body {
    color: #000;
  }
</style>

<template>
    <header-view></header-view>
    <div id="main" class="main">
      <article class="article">
        <router-view  class="router-view"
                      keep-alive
                      transition
                      transition-mode="out-in">
        </router-view>
      </article>
      <aside-view></aside-view>
    </div>
    <footer-view></footer-view>
</template>

<script>

  // 依赖组件
  import HeaderView from './components/layout/HeaderView.vue'
  import FooterView from './components/layout/FooterView.vue'
  import AsideView from './components/layout/AsideView.vue'

  // 模块配置
  export default {

    // 依赖组件
    components: {
      HeaderView,
      FooterView,
      AsideView
    }
  }

</script>