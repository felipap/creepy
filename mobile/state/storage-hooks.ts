import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

// Need to make this available because tasks can't use hooks.
export async function readLocalStorage(key: string) {
	const value = await AsyncStorage.getItem(key);
	return value ? JSON.parse(value) : null;
}

export async function writeLocalStorage(key: string, value: any) {
	await AsyncStorage.setItem(key, JSON.stringify(value));
}

type JsonValue =
	| string
	| number
	| boolean
	| null
	| JsonValue[]
	| { [key: string]: JsonValue };

// Shared state for all components using useLocalStorage
const sharedState = new Map<string, any>();
const listeners = new Map<string, Set<(value: any) => void>>();

export const useLocalStorage = <T extends JsonValue>(
	key: string,
	initialValue: T
) => {
	const [localValue, setLocalValue] = useState<T>(initialValue);
	const [loading, setLoading] = useState(true);

	async function loadStoredValue() {
		try {
			const value = await readLocalStorage(key);
			setLocalValue(value);
			sharedState.set(key, value);
		} catch (error) {
			console.error(`[useLocalStorage] Error loading value for ${key}:`, error);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		loadStoredValue();

		// Subscribe to changes
		if (!listeners.has(key)) {
			listeners.set(key, new Set());
		}
		const listener = (value: T) => {
			setLocalValue(value);
		};
		listeners.get(key)!.add(listener);

		return () => {
			listeners.get(key)!.delete(listener);
		};
	}, [key]);

	async function setValue(valueOrFunction: T | ((prev: T) => T)) {
		try {
			const value =
				typeof valueOrFunction === 'function'
					? // @ts-ignore
						valueOrFunction(localValue)
					: valueOrFunction;
			setLocalValue(value);
			sharedState.set(key, value);
			await writeLocalStorage(key, value);

			// Notify all listeners
			listeners.get(key)?.forEach((listener) => listener(value));
		} catch (error) {
			console.error(`[useLocalStorage] Error setting value for ${key}:`, error);
		}
	}

	return [localValue, setValue, loading] as const;
};
