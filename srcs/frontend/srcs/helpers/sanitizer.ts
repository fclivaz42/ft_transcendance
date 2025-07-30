export function sanitizer(data: any): any {
	if (data === null || data === undefined) {
		return data;
	}

	if (typeof data === "string") {
		const sanitized = data
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/\n/g, "<br>")
			.replace(/"/g, "&quot;")
			.replace(/"/g, "&#39;");
		if (sanitized !== data)
			console.warn("Sanitizer modified the string:", data, "to", sanitized);
		return sanitized;
	}

	if (Array.isArray(data))
		return data.map(item => sanitizer(item));

	if (typeof data === "object") {
		const sanitizedObject: Record<string, any> = {};
		for (const key in data) {
			if (data.hasOwnProperty(key)) {
				sanitizedObject[key] = sanitizer(data[key]);
			}
		}
		return sanitizedObject;
	}

	return data;
}
