export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),

  database: {
    mysql: {
      host: process.env.MYSQL_HOST ?? 'localhost',
      port: parseInt(process.env.MYSQL_PORT ?? '3306', 10),
      user: process.env.MYSQL_USER ?? 'superlearning',
      password: process.env.MYSQL_PASSWORD ?? 'superlearning',
      database: process.env.MYSQL_DATABASE ?? 'superlearning_live',
    },
    mongo: {
      uri:
        process.env.MONGO_URI ??
        'mongodb://superlearning:superlearning@localhost:27017/superlearning_live?authSource=admin',
    },
    redis: {
      host: process.env.REDIS_HOST ?? 'localhost',
      port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
    },
  },

  jwt: {
    secret: process.env.JWT_SECRET ?? 'change-me-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '1h',
  },

  catenoid: {
    apiBaseUrl:
      process.env.CATENOID_API_BASE_URL ??
      'https://api.kollus.com',
    serviceAccountKey: process.env.CATENOID_SERVICE_ACCOUNT_KEY ?? '',
    apiAccessToken: process.env.CATENOID_API_ACCESS_TOKEN ?? '',
    customKey: process.env.CATENOID_CUSTOM_KEY ?? '',
    securityKey: process.env.CATENOID_SECURITY_KEY ?? '',
  },
});
