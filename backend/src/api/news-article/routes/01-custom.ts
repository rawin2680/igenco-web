export default {
  routes: [
    {
      method: 'POST',
      path: '/news-articles/:id/unpublish',
      handler: 'api::news-article.news-article.unpublish',
    },
  ],
};
