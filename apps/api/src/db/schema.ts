import { pgTable, serial, varchar, timestamp, boolean, integer, text } from "drizzle-orm/pg-core";

export const trackedRepositories = pgTable("tracked_repositories", {
  id: serial("id").primaryKey(),
  owner: varchar("owner", { length: 100 }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
});

export const releases = pgTable("releases", {
  id: serial("id").primaryKey(),
  repositoryId: integer("repository_id")
    .references(() => trackedRepositories.id)
    .notNull(),
  tagName: varchar("tag_name", { length: 100 }).notNull(),
  body: text("body").default("").notNull(),
  publishedAt: timestamp("published_at"),
  htmlUrl: varchar("html_url", { length: 255 }).notNull(),
  seen: boolean("seen").default(false).notNull(),
});
