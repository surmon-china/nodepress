var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello World!',
    objc: {
      a: 13123,
      b: 2345342523
    },
    arrc: [{ name: 1 }, { name: 2 }],
    
  },
  methods: {
    clicktest: params => {
      console.log(typeof params);
      alert(typeof params == 'string' ? params : 'click!')
    },
    clicktest2: (params, event) => {
      console.log(event);
      alert(params)
    },
    onSubmit: () => {
      alert('提交表单')
    }
  }
});