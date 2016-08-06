<style lang="stylus">
</style>

<template>
  <div class="article-list-item" v-show="item">

    <a href="#">
      <div class="media">
        <div class="media-left media-middle">
            <img class="media-object" data-src="holder.js/64x64" alt="Generic placeholder image">
        </div>
        <div class="media-body">
          <h4 class="media-heading">文章标题</h4>
          <p>Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.</p>
          <p>Donec sed odio dui. Nullam quis risus eget urna mollis ornare vel eu leo. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p>
        </div>
      </div>
    </a>
    <!-- <p class="itemtext" v-if="hasText" v-html="item.text"></p>
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
    <p v-show="!comments.length && !isJob">No comments yet.</p> -->
  </div>
</template>

<script>

export default {

  name: 'ListItemView',

  components: {
    // Item,
    // Comment
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
      // return store.fetchItem(to.params.id).then(item => {
      //   document.title = item.title + ' | Vue.js HN Clone'
      //   return {
      //     item,
      //     // the final resolved data can further contain Promises
      //     comments: store.fetchItems(item.kids),
      //     pollOptions: item.type === 'poll'
      //       ? store.fetchItems(item.parts)
      //       : null
      //   }
      // })
    }
  },

  computed: {
    // isJob () {
    //   return this.item.type === 'job'
    // },

    // hasText () {
    //   return this.item.hasOwnProperty('text')
    // }
  }
}
</script>
