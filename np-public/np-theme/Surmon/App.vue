<style lang="stylus">
  @import './stylus/variables'
  body
    padding-top 4em
    
    .container
      position relative
    
    article
      width 40em
      min-height 40em
      margin-left 11em
      padding-top 1em
</style>

<template>
    <header-view></header-view>
    <div id="main" class="main">
      <div class="container">
        <nav-view></nav-view>
        <article class="article">
          <router-view  class="router-view"
                        keep-alive
                        transition
                        transition-mode="out-in">
          </router-view>
        </article>
        <aside-view></aside-view>
      </div>
    </div>
    <footer-view></footer-view>
</template>

<script>

  // 依赖组件
  import HeaderView from './components/layout/HeaderView.vue'
  import FooterView from './components/layout/FooterView.vue'
  import AsideView from './components/layout/AsideView.vue'
  import NavView from './components/layout/NavView.vue'

  // 模块配置
  export default {

    // 依赖组件
    components: {
      HeaderView,
      FooterView,
      AsideView,
      NavView
    }
  }

</script>