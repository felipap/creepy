/* eslint-disable no-console */

import { Chat } from '@/db/schema';
import * as Sentry from '@sentry/nextjs';
import chalk from 'chalk';
import safeStringify from 'json-stringify-safe';

type Severity = 'log' | 'error' | 'warn' | 'debug' | 'info';

export function genericLog(severity: Severity, message: string, args?: any) {
	if (severity === 'error') {
		Sentry.captureMessage(message, {
			extra: {
				...args,
			},
		});
	}

	if (process.env.NODE_ENV === 'development') {
		const color =
			severity === 'log'
				? null
				: severity === 'error'
				? chalk.red
				: severity === 'warn'
				? chalk.yellow
				: severity === 'debug'
				? null
				: null;
		console[severity](color ? color(message) : message, args || '');
		return;
	}

	console[severity](message, safeStringify(args));
}

export function log(message: string, args?: any) {
	genericLog('log', message, args);
}

export function logErrorForChat(chat: Chat, message: string, context?: any) {
	genericLog('error', message, { context, chatId: chat.id });
}

export function error(message: string, context?: any) {
	genericLog('error', message, context);
}

export function warn(message: string, context?: any) {
	genericLog('warn', message, context);
}

export function debug(message: string, args?: any) {
	genericLog('debug', message, args);
}

export function info(message: string, args?: any) {
	genericLog('info', message, args);
}

export function trace(message: string, args?: any) {
	console.trace(message, args);
}

export function fatal(message: string, args?: any) {
	genericLog('error', message, args);
}

export const logger = {
	log,
	error,
	warn,
	debug,
	info,
	fatal,
};
