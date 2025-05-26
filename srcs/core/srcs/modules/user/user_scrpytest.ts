// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   db_scrpytest.js                                    :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/05/06 03:04:25 by fclivaz           #+#    #+#             //
//   Updated: 2025/05/07 17:11:51 by fclivaz          ###   LAUSANNE.ch       //
//                                                                            //
// ************************************************************************** //

import * as crypto from 'crypto';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

const plaintext = await rl.question("enter password >> ");
rl.close()
crypto.randomBytes(64, (err, buf) => {
	if (err) throw err;
	const salt = buf.toString('base64')
	crypto.scrypt(plaintext, salt, 64, (err, derivedKey) => {
		if (err) throw err;
		const object = {
			'PlayerID': crypto.randomUUID(),
			'DisplayName': "Bropler",
			'PassHash': salt + "$$" + derivedKey.toString('base64'),
			'EmailAddress': 'fclivaz@email.com',
			'PhoneNumber': '0123456789',
			'RealName': 'Fabos',
			'Surname': 'L\'éclatos',
			'Bappy': 186253162,
			'Admin': 0,
			'ActiveTokens': 'NULL'
		}
		console.dir(object)
	})
})
