// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   db_tests.ts                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/05/31 20:07:43 by fclivaz           #+#    #+#             //
//   Updated: 2025/06/24 21:26:31 by fclivaz          ###   LAUSANNE.ch       //
//                                                                            //
// ************************************************************************** //

import type * as at from "axios"
import DatabaseSDK from "../../libs/helpers/databaseSdk.ts"
import type { Users } from "../../libs/interfaces/Users.ts"

const sdk = new DatabaseSDK()

const user: Users = {
	DisplayName: "hello",
	Password: "incrediblystrongpassword",
	EmailAddress: "whatever@email.com",
	FriendsList: ["P-0",
		"P-67d6593b-5e55-46da-848c-8fd7c0307bd4"]
}
let swag = await sdk.create_user(user)
console.dir(swag.data)
console.dir((await sdk.get_user_friends("P-59f185e3-f80c-4733-9955-4470919d87d9")).data)
