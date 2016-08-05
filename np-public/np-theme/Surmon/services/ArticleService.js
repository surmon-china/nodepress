export const ArticleService = {

  getList: function(ctx, params) {
    return ctx.$http.get('/api/article', params);
  },

  getItem: function(ctx, params) {
    return ctx.$http.post('/api/article/:article_slug', params);
  }
}