CREATE TABLE "releases" (
	"id" serial PRIMARY KEY NOT NULL,
	"repository_id" integer NOT NULL,
	"tag_name" varchar(100) NOT NULL,
	"published_at" timestamp,
	"html_url" varchar(255) NOT NULL,
	"seen" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tracked_repositories" (
	"id" serial PRIMARY KEY NOT NULL,
	"owner" varchar(100) NOT NULL,
	"name" varchar(100) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "releases" ADD CONSTRAINT "releases_repository_id_tracked_repositories_id_fk" FOREIGN KEY ("repository_id") REFERENCES "public"."tracked_repositories"("id") ON DELETE no action ON UPDATE no action;