import { createId } from '@paralleldrive/cuid2';
import { CoreMessage } from 'ai';
import assert from 'assert';
import { InferSelectModel, relations } from 'drizzle-orm';
import {
	AnyPgColumn,
	boolean,
	index,
	integer,
	jsonb,
	pgTable,
	serial,
	text,
	timestamp,
} from 'drizzle-orm/pg-core';

export const USER_TIMEZONES = [
	'America/Los_Angeles',
	'America/New_York',
	'America/Chicago',
	'America/Denver',
	'Europe/London',
	'Europe/Paris',
	'Europe/Berlin',
	'Asia/Tokyo',
	'Asia/Shanghai',
	'Asia/Singapore',
	'Australia/Sydney',
	'Pacific/Auckland',
] as const;

export type UserTimezone = (typeof USER_TIMEZONES)[number];

export const Users = pgTable('users', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
	pushToken: text('push_token'),
	lastSeenAt: timestamp('last_seen_at', { withTimezone: true }),
	googleAccessToken: text('google_access_token'),
	googleRefreshToken: text('google_refresh_token'),
	clerkUserId: text('clerk_user_id'),
	googleTokenExpiry: timestamp('google_token_expiry'),
	timezone: text('timezone', {
		enum: USER_TIMEZONES,
	})
		.notNull()
		.default('America/Los_Angeles'),
	notificationsEnabled: boolean('notifications_enabled').notNull(),
	contextWindowSize: integer('context_window_size'),
});

export type User = InferSelectModel<typeof Users>;

//
//
//

export const Activities = pgTable('activities', {
	id: text('id').primaryKey(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	label: text('label').notNull(),
	emoji: text('emoji').notNull(),
});

export type Activity = InferSelectModel<typeof Activities>;

//
//
//

export const Events = pgTable(
	'events',
	{
		id: serial('id').primaryKey(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		userId: integer('user_id')
			.notNull()
			.references(() => Users.id),
		startedAt: timestamp('started_at', { withTimezone: true }),
		endedAt: timestamp('ended_at', { withTimezone: true }),
		activityId: text('activity_id').references(() => Activities.id),
		title: text('title'),
		externalId: text('external_id'),
		source: text('source'),
	},
	(table) => [
		index('events_external_id_source_key').on(table.externalId, table.source),
	]
);

export const EventsRelations = relations(Events, ({ one }) => ({
	activity: one(Activities, {
		fields: [Events.activityId],
		references: [Activities.id],
	}),
}));

export type Event = InferSelectModel<typeof Events>;

//
//
//

export const Dislocations = pgTable('dislocations', {
	id: serial('id').primaryKey(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	userId: integer('user_id')
		.notNull()
		.references(() => Users.id),
	startLocationId: integer('start_location_id')
		.notNull()
		.references(() => Locations.id),
	endLocationId: integer('end_location_id')
		.notNull()
		.references(() => Locations.id),
	startedAt: timestamp('started_at', { withTimezone: true }),
	endedAt: timestamp('ended_at', { withTimezone: true }),
	label: text('label'),
});

//
//
//

export const Captures = pgTable('captures', {
	id: serial('id').primaryKey(),
	createdAt: timestamp('created_at', { withTimezone: true })
		.defaultNow()
		.notNull(),
	userId: integer('user_id')
		.notNull()
		.references(() => Users.id),
	timestamp: timestamp('timestamp', { withTimezone: true }).notNull(),
	content: text('screenshot'),
	summaryId: integer('summary_id').references(() => CaptureSummaries.id, {
		onDelete: 'set null',
	}),
	resolution: text('resolution'),
});

export type Capture = InferSelectModel<typeof Captures>;

export const CaptureSummaries = pgTable('capture_summaries', {
	id: serial('id').primaryKey(),
	captureId: serial('capture_id')
		.notNull()
		.references((): AnyPgColumn => Captures.id, {
			onDelete: 'cascade',
		}),
	summary: text('summary').notNull(),
	model: text('model').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export type CaptureSummary = InferSelectModel<typeof CaptureSummaries>;

export const CapturesRelations = relations(Captures, ({ one }) => ({
	summary: one(CaptureSummaries, {
		fields: [Captures.summaryId],
		references: [CaptureSummaries.id],
	}),
}));

export const CaptureSummariesRelations = relations(
	CaptureSummaries,
	({ one }) => ({
		capture: one(Captures, {
			fields: [CaptureSummaries.captureId],
			references: [Captures.id],
		}),
	})
);

//
//
//

export const Locations = pgTable('locations', {
	id: serial('id').primaryKey(),
	timestamp: timestamp('created_at').defaultNow().notNull(),
	userId: integer('user_id')
		.notNull()
		.references(() => Users.id),
	// Consider using `point` https://orm.drizzle.team/docs/guides/point-datatype-psql
	// point('location', { mode: 'xy' }).notNull()
	latitude: text(),
	longitude: text(),
	placeLabel: text(),
	accuracy: text(),
	source: text(),
});

export type Location = InferSelectModel<typeof Locations>;

//
//
// Chat

export const Chats = pgTable('chats', {
	id: serial('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => Users.id),
	title: text('title'),
	lastMessageAt: timestamp('last_message_at', {
		withTimezone: true,
	}).defaultNow(),
	lastTickAt: timestamp('last_ticked_at', {
		withTimezone: true,
	}),
	createdAt: timestamp('created_at', { withTimezone: true })
		.defaultNow()
		.notNull(),
	systemPrompt: text('system_prompt'),
	bumpFrequencyMinutes: integer('bump_frequency_minutes'),
	// Lock the chat to prevent multiple users from generating from it at once.
	// lockedAt: timestamp('locked_at', { withTimezone: true }),
});

export type Chat = InferSelectModel<typeof Chats>;

export const ToolCalls = pgTable('tool_calls', {
	id: serial('id').primaryKey(),
	createdAt: timestamp('created_at', { withTimezone: true })
		.defaultNow()
		.notNull(),
	toolName: text('tool_name').notNull(),
	arguments: text('arguments').notNull(),
	result: text('result').notNull(),
});

export type ToolCall = InferSelectModel<typeof ToolCalls>;

//

export const Messages = pgTable(
	'messages',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => createId()),
		createdAt: timestamp('created_at', { withTimezone: true })
			.defaultNow()
			.notNull(),
		chatId: integer('chat_id')
			.notNull()
			.references(() => Chats.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
		content: jsonb('content').notNull(),
		systemMessageTag: text('system_message_tag', {
			enum: ['bump', 'reminder'],
		}),
		// Messages that are generated to respond to the user message.
		responseId: text('response_id').references(
			(): AnyPgColumn => AssistantResponses.id,
			{ onDelete: 'cascade', onUpdate: 'cascade' }
		),
		assistantMessageTag: text('assistant_message_tag', {
			enum: ['skip'],
		}),
		role: text('role', {
			enum: ['user', 'assistant', 'system', 'tool'],
		}).notNull(),
		toolCallId: integer('tool_call_id').references(() => ToolCalls.id),
		contextSavedForDebug: jsonb('context_saved_for_debug'),
	},
	(table) => [
		index('messages_chat_id_created_at_idx').on(table.chatId, table.createdAt),
	]
);

export type Message = InferSelectModel<typeof Messages>;

//

// A response is a group of assistant or tool call messages generated by a model
// as a response to a user or system.
export const AssistantResponses = pgTable('responses', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => createId()),
	createdAt: timestamp('created_at', { withTimezone: true })
		.defaultNow()
		.notNull(),
	isSkip: boolean('is_skip'),
	chatId: integer('chat_id')
		.notNull()
		.references(() => Chats.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	responseToMessageId: text('response_to_message_id').references(
		() => Messages.id
	),
	model: text('model').notNull(),
});

export type AssistantResponse = InferSelectModel<typeof AssistantResponses>;

//

export function validateCoreMessage(message: {
	role: string;
	content: any;
}): asserts message is CoreMessage {
	if (message.role === 'system') {
		assert(typeof message.content === 'string');
		return;
	}
	if (message.role === 'user') {
		if (typeof message.content === 'string') {
			return;
		}
		if (Array.isArray(message.content)) {
			return;
		}
		throw new Error('Invalid user message content');
	}
	if (message.role === 'assistant') {
		if (typeof message.content === 'string') {
			return;
		}
		if (Array.isArray(message.content)) {
			return;
		}
		throw new Error('Invalid assistant message content');
	}
	if (message.role === 'tool') {
		if (typeof message.content === 'string') {
			return;
		}
		if (Array.isArray(message.content)) {
			return;
		}
		throw new Error('Invalid tool message content');
	}
}

export const ToolCallsRelations = relations(ToolCalls, ({ many }) => ({
	messages: many(Messages),
}));

export const MessagesRelations = relations(Messages, ({ one }) => ({
	toolCall: one(ToolCalls, {
		fields: [Messages.toolCallId],
		references: [ToolCalls.id],
	}),
	assistantResponse: one(AssistantResponses, {
		fields: [Messages.responseId],
		references: [AssistantResponses.id],
	}),
}));

export const UsersRelations = relations(Users, ({ many, one }) => ({
	chats: many(Chats),
	memories: many(Memories),
	preferences: many(Preferences),
	activeChat: one(Chats, {
		fields: [Users.id],
		references: [Chats.userId],
	}),
}));

export const ChatsRelations = relations(Chats, ({ many, one }) => ({
	messages: many(Messages),
	user: one(Users, {
		fields: [Chats.userId],
		references: [Users.id],
	}),
}));

//
//
// Memories

export const Documents = pgTable('documents', {
	id: serial('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => Users.id),
	title: text('title').notNull(),
	content: text('content').notNull(),
	reference: text('reference'),
	externalId: text('external_id'),
	externalUrl: text('external_url'),
	isMarkdown: boolean('is_markdown').default(false),
	date: timestamp('date', { withTimezone: true }),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Document = InferSelectModel<typeof Documents>;

export const Memories = pgTable(
	'memories',
	{
		id: serial('id').primaryKey(),
		userId: integer('user_id')
			.notNull()
			.references(() => Users.id),
		content: text('content').notNull(),
		source: text('source', {
			enum: ['tool-call', 'user', 'document'],
		}).notNull(),
		chatId: integer('chat_id').references(() => Chats.id),
		sourceDocumentId: integer('source_document_id').references(
			() => Documents.id
		),
		sourceMessageId: text('source_message_id').references(() => Messages.id, {
			// Consider this later.
			onDelete: 'cascade',
		}),
		when: text('when'),
		entryDate: timestamp('entry_date', {
			withTimezone: true,
		}),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	(table) => [
		index('memories_source_document_id_idx').on(table.sourceDocumentId),
	]
);

export type Memory = InferSelectModel<typeof Memories>;

export const MemoryEmbeddings = pgTable(
	'memory_embeddings',
	{
		id: serial('id').primaryKey(),
		memoryId: integer('memory_id')
			.notNull()
			.references(() => Memories.id, { onDelete: 'cascade' }),
		text: text('text').notNull(),
		embedding: text('embedding').notNull(),
		isExcerpt: boolean('is_excerpt').default(false),
		chunkIndex: integer('chunk_index'),
		model: text('model').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
	},
	(table) => [index('memory_embeddings_memory_id_idx').on(table.memoryId)]
);

export type MemoryEmbedding = InferSelectModel<typeof MemoryEmbeddings>;

export const MemoryEmbeddingsRelations = relations(
	MemoryEmbeddings,
	({ one }) => ({
		memory: one(Memories, {
			fields: [MemoryEmbeddings.memoryId],
			references: [Memories.id],
		}),
	})
);

export const MemoriesRelations = relations(Memories, ({ one }) => ({
	sourceDocument: one(Documents, {
		fields: [Memories.sourceDocumentId],
		references: [Documents.id],
	}),
	sourceMessage: one(Messages, {
		fields: [Memories.sourceMessageId],
		references: [Messages.id],
	}),
}));

export const DocumentsRelations = relations(Documents, ({ many }) => ({
	memories: many(Memories),
}));

//
//
// Notifications

export const DesktopNotifications = pgTable('chat_notifications', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => createId()),
	userId: integer('user_id')
		.notNull()
		.references(() => Users.id),
	createdAt: timestamp('created_at', { withTimezone: true })
		.defaultNow()
		.notNull(),
	chatId: integer('chat_id')
		.notNull()
		.references(() => Chats.id),
	content: text('content').notNull(),
});

export type DesktopNotification = InferSelectModel<typeof DesktopNotifications>;

//
//
// Preferences

export const Preferences = pgTable('preferences', {
	id: serial('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => Users.id),
	content: text('content').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
	// Used to tag certain preferences as more important.
	// tag: text('tag'),
});

export type Preference = InferSelectModel<typeof Preferences>;

export const PreferenceEmbeddings = pgTable('preference_embeddings', {
	id: serial('id').primaryKey(),
	preferenceId: integer('preference_id')
		.notNull()
		.references(() => Preferences.id, { onDelete: 'cascade' }),
	text: text('text').notNull(),
	embedding: text('embedding').notNull(),
	isExcerpt: boolean('is_excerpt').default(false),
	chunkIndex: integer('chunk_index'),
	model: text('model').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type PreferenceEmbedding = InferSelectModel<typeof PreferenceEmbeddings>;

export const PreferenceEmbeddingsRelations = relations(
	PreferenceEmbeddings,
	({ one }) => ({
		preference: one(Preferences, {
			fields: [PreferenceEmbeddings.preferenceId],
			references: [Preferences.id],
		}),
	})
);

export const PreferencesRelations = relations(Preferences, ({ one }) => ({
	user: one(Users, {
		fields: [Preferences.userId],
		references: [Users.id],
	}),
}));

//
//
//
//
//

export const DeviceSessions = pgTable(
	'device_sessions',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => createId()),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		userId: integer('user_id')
			.notNull()
			.references(() => Users.id),
		expiresAt: timestamp('expires_at').notNull(),
		lastUsedAt: timestamp('last_used_at').notNull(),
		deviceId: text('device_id'),
		token: text('token').notNull(),
		requestId: text('request_id').references(() => DeviceAuthRequests.id),
	},
	(table) => {
		return [index('device_sessions_user_idx').on(table.userId)];
	}
);

export type DeviceSession = typeof DeviceSessions.$inferSelect;

export const DeviceAuthRequests = pgTable(
	'device_auth_requests',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => createId()),
		whatever: text('whatever').notNull().unique(),
		deviceId: text('device_id'), // later
		userId: integer('user_id')
			.notNull()
			.references(() => Users.id, { onDelete: 'cascade' }),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		expiresAt: timestamp('expires_at').notNull(),
		usedAt: timestamp('used_at'),
	},
	(table) => {
		return [
			// Index for querying by userId (for auditing/management)
			index('device_auths_user_idx').on(table.userId),
			// Index for cleanup of expired tokens
			index('device_auths_expiry_idx').on(table.expiresAt),
		];
	}
);

export type DeviceAuthRequest = typeof DeviceAuthRequests.$inferSelect;

//
//
// Evals

export const Evals = pgTable('evals', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => createId()),
	userId: integer('user_id')
		.notNull()
		.references(() => Users.id),
	name: text('name').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// export const EvalRules = pgTable('eval_rules', {
// 	id: serial('id').primaryKey(),
// 	createdAt: timestamp('created_at').defaultNow().notNull(),
// 	updatedAt: timestamp('updated_at').defaultNow().notNull(),
// });
