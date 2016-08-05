<template>
  <div class="item">
    <span class="index">{{ index }}.</span>
    <p>
      <a class="title" :href="href" target="_blank">{{{ item.title }}}</a>
      <span class="domain" v-show="showDomain">
        ({{ item.url | domain }})
      </span>
    </p>
    <p class="subtext">
      <span v-show="showInfo">
        {{ item.score }} points by
        <a :href="'#/user/' + item.by">{{ item.by }}</a>
      </span>
      {{ item.time | fromNow }} ago
      <span class="comments-link" v-show="showInfo">
        | <a :href="'#/item/' + item.id">{{item.descendants}} {{item.descendants | pluralize 'comment'}}</a>
      </span>
    </p>
  </div>
</template>

<script>
export default {

  // 模块名称
  name: 'Item',

  // 声明 props 获取数据
  props: {
    item: Object,
    index: Number
  },

  // 已编译
  computed: {
    href () {
      return this.item.url || ('#/item/' + this.item.id)
    },
    showInfo () {
      return this.item.type === 'story' || this.item.type === 'poll'
    },
    showDomain () {
      return this.item.type === 'story'
    }
  }
}
</script>

<style lang="stylus">

</style>
