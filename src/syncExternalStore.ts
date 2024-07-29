import { useState, useEffect } from "react";

type Subscribe = (onStoreChange: () => void) => () => void;
type GetSnapshot<T> = () => T;

/**
 * Custom hook that mimics the behavior of React's useSyncExternalStore.
 *
 * @template T - The type of the state.
 * @param {Subscribe} subscribe - The function to subscribe to store changes.
 * @param {GetSnapshot<T>} getSnapshot - The function to get the current state snapshot.
 * @returns {T} - The current state.
 * @author github.com/masrurimz
 */
export const useSyncExternalStore = <T>(
	subscribe: Subscribe,
	getSnapshot: GetSnapshot<T>,
): T => {
	const [state, setState] = useState<T>(getSnapshot());

	useEffect(() => {
		const handleStoreChange = () => {
			const nextSnapshot = getSnapshot();
			setState(nextSnapshot);
		};

		const unsubscribe = subscribe(handleStoreChange);
		handleStoreChange(); // Check for updates right after subscription

		return () => unsubscribe();
	}, [subscribe, getSnapshot]);

	return state;
};
