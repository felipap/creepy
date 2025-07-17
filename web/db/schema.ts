import { InferSelectModel } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const DEFAULT_USER_ID = 1;

// Just as a placeholder.
export type User = {
	id: number;
};

export const Places = pgTable('places', {
	id: serial('id').primaryKey(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
	userId: integer('user_id')
		.notNull()
		// .references(() => Users.id)
		.default(DEFAULT_USER_ID),
	name: text(),
	latitude: text().notNull(),
	longitude: text().notNull(),
});

export type Place = InferSelectModel<typeof Places>;

export const Locations = pgTable('locations', {
	id: serial('id').primaryKey(),
	timestamp: timestamp('created_at').defaultNow().notNull(),
	userId: integer('user_id')
		.notNull()
		// .references(() => Users.id)
		.default(DEFAULT_USER_ID),
	// Consider using `point` https://orm.drizzle.team/docs/guides/point-datatype-psql
	// point('location', { mode: 'xy' }).notNull()
	latitude: text().notNull(),
	longitude: text().notNull(),
	placeId: integer('place_id').references(() => Places.id),
	accuracy: text(),
	source: text(),
});

export type Location = InferSelectModel<typeof Locations>;

// export const Dislocations = pgTable('dislocations', {
// 	id: serial('id').primaryKey(),
// 	createdAt: timestamp('created_at').defaultNow().notNull(),
// 	// userId: integer('user_id')
// 	// 	.notNull()
// 	// 	.references(() => Users.id),
// 	startLocationId: integer('start_location_id')
// 		.notNull()
// 		.references(() => Locations.id),
// 	endLocationId: integer('end_location_id')
// 		.notNull()
// 		.references(() => Locations.id),
// 	startedAt: timestamp('started_at', { withTimezone: true }),
// 	endedAt: timestamp('ended_at', { withTimezone: true }),
// 	label: text('label'),
// });

// export type Dislocation = InferSelectModel<typeof Dislocations>;
