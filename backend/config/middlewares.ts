export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      headers: '*',
      origin: [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'https://igenco-demo2.vercel.app',
        /^https:\/\/.*\.vercel\.app$/,
        ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
      ],
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
