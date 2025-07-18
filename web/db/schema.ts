import { createId } from '@paralleldrive/cuid2'
import { InferSelectModel } from 'drizzle-orm'
import {
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'

export const DEFAULT_USER_ID = 1

// Just as a placeholder.
export type User = {
  id: number
}

export const Places = pgTable('places', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('timestamp').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  userId: integer('user_id')
    .notNull()
    // .references(() => Users.id)
    .default(DEFAULT_USER_ID),
  name: text(),
  latitude: text().notNull(),
  longitude: text().notNull(),
})

export type Place = InferSelectModel<typeof Places>

export const LocationInfo = pgTable('location_info', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  createdAt: timestamp('timestamp').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  locationId: text('location_id').notNull(),
  address: text(),
  city: text(),
  state: text(),
  country: text(),
})

export type LocationInfo = InferSelectModel<typeof LocationInfo>

export const Locations = pgTable(
  'locations',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    // A unique ID on the app side. Used for deduplication. FIXME better name
    // for this.
    uniqueId: text('unique_id').notNull(),
    timestamp: timestamp('timestamp').defaultNow().notNull(),
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
    // We'll allow this to be null while the information isn't available.
    locationInfoId: text('location_info_id').references(() => LocationInfo.id),
  },
  table => [index('unique_id_user_id_idx').on(table.uniqueId, table.userId)],
)

export type Location = InferSelectModel<typeof Locations>

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
