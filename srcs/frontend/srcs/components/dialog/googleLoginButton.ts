export function createGoogleLoginButton(): HTMLButtonElement {
	const button = document.createElement("button") as HTMLButtonElement;

	button.className = "px-4 py-2 border flex gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150";
	// TODO: Replace client_id by an unique identifier for the browser session
	button.innerHTML = `
		<img class="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo">
		<span>Login with Google</span>
	`;
	button.onclick = async () => {
		const fetchLogin = await fetch("/oauth2/login?client_id=1");
		if (!fetchLogin.ok) {
			console.error("Failed to initiate Google login:", fetchLogin.statusText);
			return;
		}
		const loginUrl = await fetchLogin.json();
		if(!loginUrl || !loginUrl.url) {
			console.error("Invalid response from server:", loginUrl);
			return;
		}
		window.location.href = loginUrl.url;
	};
	return button;
}
