import { BaseDb } from '.';
import * as schema from './schema';

// Explicitly list tables that require userId validation
const tablesRequiringUserId = [
	schema.Memories,
	schema.Events,
	schema.Locations,
	schema.Captures,
	schema.Chats,
	schema.Documents,
	schema.Dislocations,
	schema.Preferences,
];

// Fields that, when present in where clause, exempt from userId requirement
const exemptFields = [
	'id',
	'sourceDocumentId',
	'parentId',
	'chatId',
	'locationId',
	'eventId',
	'memoryId',
	'documentId',
];

export function createSafeQueryBuilder<T extends BaseDb>(_db: T): T {
	const db = _db as any;

	// Use a Proxy to intercept method calls instead of creating a new object
	return new Proxy(db, {
		get(target, prop, receiver) {
			// If the property is 'select', return our custom implementation
			if (prop === 'select') {
				return function (...args: any[]) {
					const query = target.select(...args);
					let currentTable: any = null;

					// Override the from method to add userId validation
					const originalFrom = query.from;
					query.from = (table: any) => {
						currentTable = table;
						return originalFrom.call(query, table);
					};

					// Override the where method to validate userId requirement
					const originalWhere = query.where;
					query.where = (condition: any) => {
						const result = originalWhere.call(query, condition);

						if (currentTable && tablesRequiringUserId.includes(currentTable)) {
							const whereString = condition.toString();
							const hasUserId = whereString.includes('userId');
							const hasExemptField = exemptFields.some((field) =>
								whereString.includes(field)
							);

							if (!hasUserId && !hasExemptField) {
								throw new Error(
									`userId must be provided when querying ${
										currentTable.name
									} unless querying by specific fields (${exemptFields.join(
										', '
									)})`
								);
							}
						}

						return result;
					};

					return query;
				};
			}

			// For all other properties, return the original value
			return Reflect.get(target, prop, receiver);
		},
	}) as T;
}
