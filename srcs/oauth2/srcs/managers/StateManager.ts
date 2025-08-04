import FixedSizeMap from "../class/FixedSizeMap.ts"
import type { OauthToken } from "../interfaces/OauthInterfaces";
import { config } from "./ConfigManager.ts";

interface session {
	state: string,
	client_id: string,
	logged: boolean,
	token: OauthToken | null
}

class StateManager {
	/** state:client_id */
	private states: FixedSizeMap<string, string>;
	/** state:{client_id, status} */
	private session: FixedSizeMap<string, session>;
	
	constructor() {
		this.states = new FixedSizeMap<string, string>(500);
		this.session = new FixedSizeMap<string, session>(500);
	}

	public addState(client_id: string) {
		// remove old state from same client
		for(const pair of this.states) {
			if (pair[1] === client_id) {
				this.initSession(pair[0], null);
				break;
			}
		}
		// check if generated state is unique
		let state: string;
		do {
			state = crypto.randomUUID();
		} while (this.states.has(state));
		this.states.set(state, client_id);
		setTimeout(() => {
			this.states.delete(state);
		}, config.OauthConfig.session_timeout * 1000);
		return state;
	}

	public removeState(state: string) {
		this.states.delete(state);
	}

	public getStateValue(state: string): string | undefined {
		return this.states.get(state);
	}

	public initSession(state: string, token: OauthToken | null) {
		const logged = !(token === null);
		const current_session: session = {
			state,
			client_id: this.states.get(state) ?? "",
			logged,
			token
		}
		this.session.set(state, current_session);
		setTimeout(() => {
			this.session.delete(state);
		}, config.OauthConfig.session_timeout * 1000);
		this.removeState(state);
		return current_session;
	}

	public getSession(state: string): session | undefined {
		return this.session.get(state);
	}
}

export const stateManager = new StateManager();
