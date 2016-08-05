<style lang="stylus">
  @import '../../stylus/variables'
  .header
    position fixed
    z-index 5
    top 0
    left 0
    right 0
    background white
    border-bottom 1px solid $gray-lighter
    height 4em

    .header-logo,
    .header-action
      margin 0
      
    .header-logo
      float left

      > li
        float left
        padding 1.25em .75em
        vertical-align top

        &.header-logo-image
          padding 1em .75em

          .logo-image
            height 2em
          
        

        &.header-logo-slogan
          margin-left 2em

          >.header-logo-slogan-text
            letter-spacing .2em
            
    .header-action
      float right

      > li
        float left
        padding 1.25em .75em
        vertical-align top

        &.header-action-input
          padding 1em .75em

          >.action-input-block
            border 1px solid $gray-lighter
            border-radius $border-radius
            padding 0 .5em
            width 15em

            >.search-input
              width 100%
              border none
              padding .5em
              font-size .8em
              color $gray-light
</style>

<template>
  <header class="header">
    <div class="container">
      <ul class="header-logo">
        <li class="header-logo-image">
          <a href="/">
            <img src="/images/logo-header.svg" class="logo-image">
          </a>
        </li>
        <li class="header-logo-slogan">
          <span class="header-logo-slogan-text  text-primary">高质量的技术社区</span>
        </li>
      </ul>

      <ul class="header-action">
        <li class="header-action-input">
          <div class="action-input-block">
            <i class="icon icon-search"></i>
            <input type="input" placeholder="输入关键字搜索" class="search-input">
          </div>
        </li>
        <li class="header-action-btn">
          <a href="" class="follow-button">关注</a>
          <a href="" class="favorite-button">收藏</a>
        </li>
      </ul>
    </div>
  </header>
</template>