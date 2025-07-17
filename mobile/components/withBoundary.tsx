import { ComponentType } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { StyleSheet, View } from 'react-native';
import { Button } from './ui';
import { ThemedText } from './ui/ThemedText';

interface ErrorFallbackProps {
	error: Error;
	resetErrorBoundary: () => void;
}

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
	return (
		<View style={styles.container}>
			<ThemedText style={styles.title}>Something went wrong</ThemedText>
			<ThemedText style={styles.subtitle}>{error.message}</ThemedText>
			<Button onPress={resetErrorBoundary} title="Try again" />
		</View>
	);
}

export function withBoundary<T>(
	Comp: ComponentType<T>,
	fallback = ErrorFallback
): ComponentType<T> {
	const result = (props: any) => (
		<ReactErrorBoundary
			FallbackComponent={fallback as any}
			onReset={() => {
				// reset the state of your app so the error doesn't happen again
			}}
		>
			<Comp {...props} />
		</ReactErrorBoundary>
	);
	result.displayName = `withBoundary-${Comp.displayName}`;
	return Comp;
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 5,
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	subtitle: {
		fontSize: 16,
	},
});
