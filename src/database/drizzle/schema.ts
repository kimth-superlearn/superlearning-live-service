import {
  mysqlTable,
  varchar,
  int,
  text,
  timestamp,
  mysqlEnum,
  boolean,
} from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  role: mysqlEnum('role', ['admin', 'instructor', 'student'])
    .notNull()
    .default('student'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
});

export const videoContents = mysqlTable('video_contents', {
  id: int('id').primaryKey().autoincrement(),
  title: varchar('title', { length: 500 }).notNull(),
  description: text('description'),
  catenoidKey: varchar('catenoid_key', { length: 255 }).unique(),
  contentType: mysqlEnum('content_type', ['live', 'vod'])
    .notNull()
    .default('vod'),
  status: mysqlEnum('status', [
    'pending',
    'uploading',
    'transcoding',
    'ready',
    'failed',
    'live',
    'ended',
  ])
    .notNull()
    .default('pending'),
  duration: int('duration'),
  thumbnailUrl: varchar('thumbnail_url', { length: 1000 }),
  uploaderId: int('uploader_id').notNull(),
  channelKey: varchar('channel_key', { length: 255 }),
  rtmpUrl: varchar('rtmp_url', { length: 1000 }),
  streamKey: varchar('stream_key', { length: 255 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type VideoContent = typeof videoContents.$inferSelect;
export type NewVideoContent = typeof videoContents.$inferInsert;
