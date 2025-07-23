// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   db_tests.ts                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: fclivaz <fclivaz@student.42lausanne.ch>    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/05/31 20:07:43 by fclivaz           #+#    #+#             //
//   Updated: 2025/07/08 22:43:18 by fclivaz          ###   LAUSANNE.ch       //
//                                                                            //
// ************************************************************************** //

import type * as at from "axios"
import DatabaseSDK from "../../libs/helpers/databaseSdk.ts"
import type { User } from "../../libs/interfaces/User.ts"

const sdk = new DatabaseSDK()

console.dir((await sdk.get_matchlist()))
