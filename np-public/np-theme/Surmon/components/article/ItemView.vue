<template>
  <div class="item-view" v-show="item">
    <item :item="item"></item>
    <p class="itemtext" v-if="hasText" v-html="item.text"></p>
    <ul class="poll-options" v-if="pollOptions">
      <li v-for="option in pollOptions">
        <p>{{option.text}}</p>
        <p class="subtext">{{option.score}} points</p>
      </li>
    </ul>
    <ul class="comments" v-if="comments">
      <comment
        v-for="comment in comments"
        :comment="comment">
      </comment>
    </ul>
    <p v-show="!comments.length && !isJob">No comments yet.</p>
  </div>
</template>

<script>
import store from '../store'
import Item from './Item.vue'
import Comment from './Comment.vue'

export default {

  name: 'ItemView',

  components: {
    Item,
    Comment
  },

  data () {
    return {
      item: {},
      comments: [],
      pollOptions: null
    }
  },

  route: {
    data ({ to }) {
      return store.fetchItem(to.params.id).then(item => {
        document.title = item.title + ' | Vue.js HN Clone'
        return {
          item,
          // the final resolved data can further contain Promises
          comments: store.fetchItems(item.kids),
          pollOptions: item.type === 'poll'
            ? store.fetchItems(item.parts)
            : null
        }
      })
    }
  },

  computed: {
    isJob () {
      return this.item.type === 'job'
    },

    hasText () {
      return this.item.hasOwnProperty('text')
    }
  }
}
</script>

<style lang="stylus">
</style>
