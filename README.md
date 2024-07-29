
# Custom Jotai Implementation for Legacy React and Node.js

This library provides a custom implementation of Jotai for legacy React and Node.js environments. It offers atom creation, state management, and subscription capabilities, ensuring compatibility with older versions of React.

Tested with react 16 and nodejs10

## Installation

You can install the library via npm:

```bash
npm install jotai-legacy
```

Or via yarn:

```bash
yarn add jotai-legacy
```

## Usage

### Creating an Atom

You can create an atom with an initial value or a function to compute the initial value:

```javascript
import { atom, useAtom, useAtomValue } from 'jotai-legacy';

const countAtom = atom(0);

const countComputedAtom = atom((get) => get(countAtom) * 2);
```

### Using an Atom

Use the `useAtom` hook to get the current value of an atom and a setter function to update it:

```javascript
const [count, setCount] = useAtom(countAtom);

const increment = () => setCount((prev) => prev + 1);
```

### Using an Atom Value

Use the `useAtomValue` hook to get the current value of an atom without subscribing to updates:

```javascript
const count = useAtomValue(countAtom);
```

## API Reference

### `atom(initialValue)`

Creates an atom with the given initial value.

- `initialValue` (any | function): The initial value of the atom or a function to compute the initial value.
- Returns: An atom object with `get`, `set`, `subscribe`, and `_subscribers` methods.

### `useAtom(atom)`

Custom hook to use an atom.

- `atom` (Atom): The atom to use.
- Returns: A tuple with the current atom value and a setter function.

### `useAtomValue(atom)`

Custom hook to get the value of an atom.

- `atom` (Atom): The atom to get the value from.
- Returns: The current value of the atom.

### `useSyncExternalStore(subscribe, getSnapshot)`

Custom hook that mimics the behavior of React's `useSyncExternalStore`.

- `subscribe` (function): The function to subscribe to store changes.
- `getSnapshot` (function): The function to get the current state snapshot.
- Returns: The current state.

## Contribution

We welcome contributions to this project. Please follow the guidelines below to contribute:

1. Fork the repository.
2. Create a new branch with a descriptive name.
3. Make your changes and commit them with clear messages.
4. Open a pull request with a detailed description of your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Author

This library is developed and maintained by [masrurimz](https://github.com/masrurimz).
