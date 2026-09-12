CREATE TABLE `subscriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`email` text NOT NULL,
	`phone_number` text NOT NULL,
	`provider` text NOT NULL,
	`transaction_id` text,
	`status` text DEFAULT 'pending',
	`plan` text DEFAULT 'Monthly Briefing',
	`amount` integer DEFAULT 7,
	`started_at` integer,
	`expires_at` integer,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
