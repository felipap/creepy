export * from './storage-hooks';

export enum STORAGE_KEYS {
	LAST_SENT = 'lastSent',
	ERROR_MSG = 'errorMsg',
	TRACKING_ERROR_MSG = 'trackingErrorMsg',
	IS_TRACKING = 'isTracking',
	LAST_NOTIFICATION_CHECK = 'lastNotificationCheck',
	SHOW_RAW_MESSAGES = 'showRawMessages',
	SHOW_INTERNAL_MESSAGES = 'showInternalMessages',
}
