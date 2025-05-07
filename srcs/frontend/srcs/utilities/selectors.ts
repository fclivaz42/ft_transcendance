export function classStartingWith(str: string, classList: DOMTokenList): string | undefined {
	return Array.from(classList).find((className) => className.startsWith(str));
}

export function removeClassStartingWith(str: string, classList: DOMTokenList) {
	let className: string | undefined;
	while ((className = classStartingWith(str, classList))) {
		classList.remove(className);
	}
}