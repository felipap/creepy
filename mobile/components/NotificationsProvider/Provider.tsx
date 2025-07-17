import { NotificationTask } from '@/tasks/NotificationTask';
import { useEffect } from 'react';
import { NotificationContext } from './hook';

export const NotificationsProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	useEffect(() => {
		// NotificationTask.stop();
		NotificationTask.start();
		// startBackgroundNotifications();

		return () => {
			// console.log('component is unmounting');
		};
	}, []);

	return (
		<NotificationContext.Provider
			value={{
				notifications: [],
			}}
		>
			{children}
		</NotificationContext.Provider>
	);
};
