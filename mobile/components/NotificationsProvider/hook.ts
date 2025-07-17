import { createContext, useContext } from 'react';

export function useNotificationsState() {
	return useContext(NotificationContext);
}

export type Notification = {
	id: string;
	message: string;
	timestamp: number;
};

export type NotificationContextType = {
	notifications: Notification[];
};

export const NotificationContext = createContext<NotificationContextType>({
	notifications: [],
});
