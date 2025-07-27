export function shuffle<T>(arr: T[]): T[] {
	const copy = [...arr];
	let currentIndex: number = copy.length;

	while (currentIndex !== 0) {
		let randomIndex: number = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		[copy[currentIndex], copy[randomIndex]] = [
			copy[randomIndex],
			copy[currentIndex],
		];
	}
	return copy;
}
