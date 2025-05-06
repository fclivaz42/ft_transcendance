export function classStartingWith(str: string, classList: DOMTokenList): string | undefined {
	return Array.from(classList).find((className) => className.startsWith(str));
}