// a custom map that will erase oldest element when maxSize is reached
export default class FixedSizeMap<K, V> {
	private _map = new Map<K, V>();
	private _maxSize: number;

	constructor(maxSize: number) {
		this._maxSize = maxSize;
	}

	set(key: K, value: V) {
		if (this._map.size >= this._maxSize) {
			const oldestKey = this._map.keys().next().value;
			this._map.delete(oldestKey);
		}
		this._map.set(key, value);
	}

	get(key: K): V | undefined {
		return this._map.get(key);
	}

	has(key: K): boolean {
		return this._map.has(key);
	}

	size(): number {
		return this._map.size;
	}

	delete(key: K) {
		return this._map.delete(key);
	}

	[Symbol.iterator](): IterableIterator<[K, V]> {
		return this._map.entries();
	}
}
