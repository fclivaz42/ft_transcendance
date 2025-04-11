
export class Logger {
	static log(message) {
		const timestamp = new Date().toISOString();
		console.log(`[LOG] [${timestamp}]: ${message}`);
	}
	static info(message) {
		const timestamp = new Date().toISOString();
		console.log(`[INFO] [${timestamp}]: ${message}`);
	}
	static warn(message) {
		const timestamp = new Date().toISOString();
		console.log(`[WARNING] [${timestamp}]: ${message}`);
	}
	static error(message) {
		const timestamp = new Date().toISOString();
		console.log(`[ERROR] [${timestamp}]: ${message}`);
	}
};