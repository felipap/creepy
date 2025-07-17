// import { useClerk } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';
import { StyleSheet } from 'react-native';
import { Button } from './ui';

export const SignOutButton = () => {
	// Use `useClerk()` to access the `signOut()` function
	// const { signOut } = useClerk();

	const handleSignOut = async () => {
		try {
			// await signOut();
			// Redirect to your desired page
			Linking.openURL(Linking.createURL('/'));
		} catch (err) {
			// See https://clerk.com/docs/custom-flows/error-handling
			// for more info on error handling
			console.error(JSON.stringify(err, null, 2));
		}
	};

	return (
		<Button onPress={handleSignOut} style={styles.button}>
			Sign out
		</Button>
	);
};

const styles = StyleSheet.create({
	button: {
		paddingVertical: 6,
		paddingHorizontal: 10,
		borderWidth: 1,
		borderColor: '#AAA',
		borderRadius: 5,
		alignSelf: 'flex-start',
	},
});
