import { Stack } from 'expo-router/stack';

export default function Layout() {
	return (
		<>
			<Stack screenOptions={{ headerShown: false }} />
			{/* <SignedIn>
			</SignedIn>
			<SignedOut>
				<Redirect href="/(auth)/sign-in" />
			</SignedOut> */}
		</>
	);
}
