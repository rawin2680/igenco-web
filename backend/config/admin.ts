export default ({ env }: { env: any }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'igencoAdminJwtSecretKey32CharsMin'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT', 'igencoApiTokenSalt32CharactersMin'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT', 'igencoTransferTokenSalt32CharsMin'),
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', false),
    promoteEE: env.bool('FLAG_PROMOTE_EE', false),
  },
});
