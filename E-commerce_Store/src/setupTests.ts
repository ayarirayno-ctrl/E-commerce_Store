import '@testing-library/jest-dom';

// Polyfill IntersectionObserver for jsdom environment (TypeScript-safe)
type GI = { IntersectionObserver?: typeof IntersectionObserver };
const gi = globalThis as unknown as GI;
if (typeof gi.IntersectionObserver === 'undefined') {
	class MockIntersectionObserver implements IntersectionObserver {
		readonly root: Element | null = null;
		readonly rootMargin: string = '';
		readonly thresholds: ReadonlyArray<number> = [];
		observe(): void {}
		unobserve(): void {}
		disconnect(): void {}
		takeRecords(): IntersectionObserverEntry[] { return []; }
	}
	(globalThis as unknown as { IntersectionObserver: typeof IntersectionObserver }).IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
}

