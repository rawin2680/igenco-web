export default ({ env }: { env: any }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  // Public https URL of this backend (e.g. https://igenco-backend.up.railway.app).
  // Needed behind Railway's proxy so admin links and cookies use https.
  url: env('PUBLIC_URL', ''),
  proxy: env.bool('IS_PROXIED', env('NODE_ENV') === 'production'),
  app: {
    keys: env.array('APP_KEYS', ['igencoAppKey1', 'igencoAppKey2']),
  },
});
