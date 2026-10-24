// Node 22+ defines a native `localStorage` global that is INERT unless the
// --localstorage-file flag is supplied (it has no getItem/setItem/clear). This
// shadows the browser-like storage jsdom provides and breaks DOM tests. We
// replace it with a spec-compliant in-memory Storage so any code touching
// localStorage behaves exactly as it would in a browser.
class MemoryStorage {
  #store = new Map();
  get length() {
    return this.#store.size;
  }
  key(index) {
    return [...this.#store.keys()][index] ?? null;
  }
  getItem(key) {
    const k = String(key);
    return this.#store.has(k) ? this.#store.get(k) : null;
  }
  setItem(key, value) {
    this.#store.set(String(key), String(value));
  }
  removeItem(key) {
    this.#store.delete(String(key));
  }
  clear() {
    this.#store.clear();
  }
}

// Only install when the ambient one is missing/broken, so we never mask a real
// browser environment if one is ever provided.
if (typeof globalThis.localStorage?.getItem !== 'function') {
  Object.defineProperty(globalThis, 'localStorage', {
    value: new MemoryStorage(),
    writable: true,
    configurable: true,
  });
}
