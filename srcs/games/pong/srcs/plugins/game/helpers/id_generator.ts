import { shuffle } from "./shuffle.ts";

function generateRandomLetter(): string {
	return String.fromCharCode(65 + Math.floor(Math.random() * 26));
}

function generateRandomNumber(): number {
	return Math.floor(Math.random() * 10);
}

export function generateRoomId(): string {
	const letters = Array.from({ length: 2 }, () => generateRandomLetter());
	const numbers = Array.from({ length: 2 }, () =>
		generateRandomNumber().toString()
	);
	return shuffle(letters.concat(numbers)).join("");
}
