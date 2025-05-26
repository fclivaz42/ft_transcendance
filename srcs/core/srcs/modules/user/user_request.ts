// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   user_request.ts                                    :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/05/12 23:14:45 by fclivaz           #+#    #+#             //
//   Updated: 2025/05/24 18:03:19 by fclivaz          ###   LAUSANNE.ch       //
//                                                                            //
// ************************************************************************** //

import Axios from 'axios'
import type * as at from 'axios'

export default class Connector {
	private _request: at.AxiosInstance;
	constructor(method: string) {
		this._request = Axios.create({
			method: method,
			baseURL: "http://sarif_db:3000",
			headers: {
				'Content-Type': 'application/json',
				'api_key': process.env.API_KEY,
			}
		});

	}
	modify_data() {

	}
	execute() {

	}
}
