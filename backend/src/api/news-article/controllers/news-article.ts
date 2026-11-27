import { factories } from '@strapi/strapi';

const UID = 'api::news-article.news-article';

export default factories.createCoreController(UID, ({ strapi }) => ({
  // Hide an article from the public site (keeps it as a draft). Not available in Strapi's REST API by default.
  async unpublish(ctx) {
    const { id } = ctx.params;
    const doc = await strapi.documents(UID).findOne({ documentId: id });
    if (!doc) return ctx.notFound('ไม่พบข่าวนี้');
    await strapi.documents(UID).unpublish({ documentId: id });
    ctx.body = { data: { documentId: id, published: false } };
  },
}));
