module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'mySecretKey'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT', 'myApiTokenSalt'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT', 'myTransferTokenSalt'),
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
});