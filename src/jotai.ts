import { useSyncExternalStore } from './syncExternalStore';

/**
 * Interface for Atom.
 *
 * @template AtomType - The type of the atom value.
 */
interface Atom<AtomType> {
	get: () => AtomType;
	set: (newValue: AtomType | ((prevValue: AtomType) => AtomType)) => void;
	subscribe: (callback: (newValue: AtomType) => void) => () => void;
	_subscribers: () => number;
}

type AtomGetter<AtomType> = (get: <Target>(a: Atom<Target>) => Target) => AtomType;

/**
 * Creates an atom with initial value and subscription capabilities.
 *
 * @template AtomType - The type of the atom value.
 * @param {AtomType | AtomGetter<AtomType>} initialValue - The initial value of the atom or a function to compute the initial value.
 * @returns {Atom<AtomType>} - The created atom.
 * @see github.com/jherr/jotai-rebuild
 * @author github.com/masrurimz
 */
export function atom<AtomType>(initialValue: AtomType | AtomGetter<AtomType>): Atom<AtomType> {
	let value: AtomType = typeof initialValue !== 'function' ? initialValue : ((null as unknown) as AtomType);

	const subscribers = new Set<(newValue: AtomType) => void>();
	const subscribed = new Set<Atom<any>>();

	function get<Target>(atom: Atom<Target>) {
		let currentValue = atom.get();

		if (!subscribed.has(atom)) {
			subscribed.add(atom);
			atom.subscribe((newValue) => {
				if (currentValue === newValue) return;
				currentValue = newValue;
				computeValue();
			});
		}

		return currentValue;
	}

	async function computeValue() {
		const newValue = typeof initialValue === 'function' ? (initialValue as AtomGetter<AtomType>)(get) : value;
		value = (null as unknown) as AtomType;
		value = await newValue;
		subscribers.forEach((callback) => callback(value));
	}

	computeValue();

	return {
		get: () => value,
		set: (action: AtomType | ((prevValue: AtomType) => AtomType)) => {
			if (typeof action === 'function') {
				value = (action as (prevValue: AtomType) => AtomType)(value);
			} else {
				value = action;
			}

			computeValue();
		},
		subscribe: (callback) => {
			subscribers.add(callback);
			return () => {
				subscribers.delete(callback);
			};
		},
		_subscribers: () => subscribers.size,
	};
}

/**
 * Custom hook to use an atom.
 *
 * @template AtomType - The type of the atom value.
 * @param {Atom<AtomType>} atom - The atom to use.
 * @returns {readonly [AtomType, (newValue: AtomType | ((prevValue: AtomType) => AtomType)) => void]} - The current atom value and a setter function to update the atom value.
 * @see github.com/jherr/jotai-rebuild
 * @author github.com/masrurimz
 */
export function useAtom<AtomType>(
	atom: Atom<AtomType>,
): readonly [AtomType, (newValue: AtomType | ((prevValue: AtomType) => AtomType)) => void] {
	return [useSyncExternalStore(atom.subscribe, atom.get), atom.set] as const;
}

/**
 * Custom hook to get the value of an atom.
 *
 * @template AtomType - The type of the atom value.
 * @param {Atom<AtomType>} atom - The atom to get the value from.
 * @returns {AtomType} - The current value of the atom.
 */
export function useAtomValue<AtomType>(atom: Atom<AtomType>) {
	return useSyncExternalStore(atom.subscribe, atom.get);
}
