import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/database/drizzle/schema.ts',
  out: './drizzle',
  dialect: 'mysql',
  dbCredentials: {
    host: process.env.MYSQL_HOST ?? 'localhost',
    port: parseInt(process.env.MYSQL_PORT ?? '3306', 10),
    user: process.env.MYSQL_USER ?? 'superlearning',
    password: process.env.MYSQL_PASSWORD ?? 'superlearning',
    database: process.env.MYSQL_DATABASE ?? 'superlearning_live',
  },
});
