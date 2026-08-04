import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

export const userRoleEnum = ['admin', 'editor', 'reader'] as const;
export const articleStatusEnum = ['draft', 'reviewing', 'published'] as const;
export const aiJobStatusEnum = ['pending', 'processing', 'completed', 'failed'] as const;
export const aiAgentTypeEnum = ['breaking', 'verification', 'research', 'writing', 'editor', 'media', 'seo'] as const;

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  password: text('password'),
  role: text('role', { enum: userRoleEnum }).default('reader'),
  avatar: text('avatar'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).defaultNow().notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).defaultNow().notNull(),
});

export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).defaultNow().notNull(),
});

export const tags = sqliteTable('tags', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).defaultNow().notNull(),
});

export const sources = sqliteTable('sources', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  url: text('url').notNull(),
  reliabilityScore: integer('reliability_score').default(50),
  type: text('type'), // official, news, social
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).defaultNow().notNull(),
});

export const articles = sqliteTable('articles', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  summary: text('summary'),
  content: text('content').notNull(),
  authorId: text('author_id').references(() => users.id),
  categoryId: text('category_id').references(() => categories.id),
  status: text('status', { enum: articleStatusEnum }).default('draft'),
  confidenceScore: integer('confidence_score').default(0),
  readingTime: integer('reading_time'),
  publishedAt: integer('published_at', { mode: 'timestamp_ms' }),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).defaultNow().notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).defaultNow().notNull(),
  metaDescription: text('meta_description'),
  schemaJson: text('schema_json', { mode: 'json' }),
});

export const articleSources = sqliteTable('article_sources', {
  articleId: text('article_id').references(() => articles.id),
  sourceId: text('source_id').references(() => sources.id),
});

export const articleTags = sqliteTable('article_tags', {
  articleId: text('article_id').references(() => articles.id),
  tagId: text('tag_id').references(() => tags.id),
});

export const media = sqliteTable('media', {
  id: text('id').primaryKey(),
  url: text('url').notNull(),
  type: text('type'), // image, video
  altText: text('alt_text'),
  articleId: text('article_id').references(() => articles.id),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).defaultNow().notNull(),
});

export const events = sqliteTable('events', {
  id: text('id').primaryKey(),
  articleId: text('article_id').references(() => articles.id),
  timestamp: integer('timestamp', { mode: 'timestamp_ms' }).notNull(),
  description: text('description').notNull(),
});

export const comments = sqliteTable('comments', {
  id: text('id').primaryKey(),
  articleId: text('article_id').references(() => articles.id),
  userId: text('user_id').references(() => users.id),
  content: text('content').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).defaultNow().notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).defaultNow().notNull(),
});

export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  message: text('message').notNull(),
  read: integer('read', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).defaultNow().notNull(),
});

export const bookmarks = sqliteTable('bookmarks', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  articleId: text('article_id').references(() => articles.id),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).defaultNow().notNull(),
});

export const analytics = sqliteTable('analytics', {
  id: text('id').primaryKey(),
  articleId: text('article_id').references(() => articles.id),
  views: integer('views').default(0),
  uniqueVisitors: integer('unique_visitors').default(0),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).defaultNow().notNull(),
});

export const aiJobs = sqliteTable('ai_jobs', {
  id: text('id').primaryKey(),
  agentType: text('agent_type', { enum: aiAgentTypeEnum }).notNull(),
  status: text('status', { enum: aiJobStatusEnum }).default('pending'),
  inputData: text('input_data', { mode: 'json' }),
  outputData: text('output_data', { mode: 'json' }),
  startedAt: integer('started_at', { mode: 'timestamp_ms' }),
  completedAt: integer('completed_at', { mode: 'timestamp_ms' }),
});

export const logs = sqliteTable('logs', {
  id: text('id').primaryKey(),
  level: text('level').notNull(),
  message: text('message').notNull(),
  context: text('context', { mode: 'json' }),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  articles: many(articles),
  comments: many(comments),
  bookmarks: many(bookmarks),
  notifications: many(notifications),
}));

export const articlesRelations = relations(articles, ({ one, many }) => ({
  author: one(users, { fields: [articles.authorId], references: [users.id] }),
  category: one(categories, { fields: [articles.categoryId], references: [categories.id] }),
  media: many(media),
  events: many(events),
  comments: many(comments),
  analytics: many(analytics),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  articles: many(articles),
}));

export const sourcesRelations = relations(sources, ({ many }) => ({
  articles: many(articleSources),
}));

export const articleSourcesRelations = relations(articleSources, ({ one }) => ({
  article: one(articles, { fields: [articleSources.articleId], references: [articles.id] }),
  source: one(sources, { fields: [articleSources.sourceId], references: [sources.id] }),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  articles: many(articleTags),
}));

export const articleTagsRelations = relations(articleTags, ({ one }) => ({
  article: one(articles, { fields: [articleTags.articleId], references: [articles.id] }),
  tag: one(tags, { fields: [articleTags.tagId], references: [tags.id] }),
}));
