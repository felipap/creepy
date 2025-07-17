import { useMainStore } from '@/state/store';
import { NotificationTask } from '@/tasks/NotificationTask';
import React, { useState } from 'react';
import { Switch } from 'react-native';

export const NotificationsSwitch = () => {
	const { user, updateNotificationSettings } = useMainStore();
	const [isLoading, setIsLoading] = useState(false);

	const toggleNotifications = async () => {
		if (isLoading || !user) {
			return;
		}
		setIsLoading(true);
		try {
			const enable = !user.notificationsEnabled;
			if (enable) {
				await NotificationTask.start();
			} else {
				await NotificationTask.stop();
			}
			await updateNotificationSettings(enable);
		} catch (err) {
			// Handle error silently
		} finally {
			setIsLoading(false);
		}
	};

	if (!user) {
		return null;
	}

	return (
		<Switch
			disabled={isLoading}
			value={user.notificationsEnabled}
			onValueChange={toggleNotifications}
			trackColor={{ false: '#767577', true: '#81b0ff' }}
			thumbColor={user.notificationsEnabled ? '#0000ff' : '#f4f3f4'}
		/>
	);
};
