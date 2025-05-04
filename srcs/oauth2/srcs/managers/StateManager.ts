import FixedSizeMap from "../class/FixedSizeMap.ts"
import type { OauthToken } from "../interfaces/OauthInterfaces.ts";

interface session {
	state: string,
	clientid: string,
	logged: boolean,
	token: OauthToken | null
}

class StateManager {
	/** state:clientid */
	private states: FixedSizeMap<string, string>;
	/** state:{clientid, status} */
	private session: FixedSizeMap<string, session>;
	
	constructor() {
		this.states = new FixedSizeMap<string, string>(500);
		this.session = new FixedSizeMap<string, session>(500);
	}

	public addState(clientid: string) {
		// remove old state from same client
		for(const pair of this.states) {
			if (pair[1] === clientid) {
				this.initSession(pair[0], null);
				break;
			}
		}
		// check if generated state is unique
		let state: string;
		do {
			state = crypto.randomUUID();
		} while (this.states.has(state));
		this.states.set(state, clientid);
		console.log(`added ${state}`);
		return state;
	}

	public removeState(state: string) {
		this.states.delete(state);
		console.log(`removed ${state}`);
	}

	public getStateValue(state: string): string | undefined {
		return this.states.get(state);
	}

	public initSession(state: string, token: OauthToken | null) {
		const logged = !(token == null);
		const current_session: session = {
			state,
			clientid: this.states.get(state) ?? "",
			logged,
			token
		}
		this.session.set(state, current_session);
		this.removeState(state);
	}

	public getSession(state: string): session | undefined {
		return this.session.get(state);
	}
}

export const stateManager = new StateManager();
