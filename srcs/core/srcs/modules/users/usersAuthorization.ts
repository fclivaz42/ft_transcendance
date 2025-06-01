import type { FastifyReply, FastifyRequest } from "fastify";
import UsersSdk from "./usersSdk.ts";

/**
 * Asks the UsersSdk to enforce user authorization based on the provided JWT token.
 * This function will throw an error if the authorization fails or if no token is provided.
 * It will also send Unauthorized responses.
 * @throws Error if the authorization fails or if no token is provided. Will also send Unauthorized responses.
 * @param rep fastify reply object
 * @param req fastify request object
 * @param usersSdk instance of UsersSdk to use for authorization
 * @returns
 */
export async function usersEnforceAuthorize(rep: FastifyReply, req: FastifyRequest, usersSdk: UsersSdk) {
  console.log("Enforcing user authorization...");
  console.log("Request headers:", req.headers);
  console.log("JWT Token:", req.headers.authorization);
  const jwtToken = await usersSdk.getAuthorize(req.headers.authorization as string);
  if (jwtToken.status !== 200) {
    rep.code(jwtToken.status).send(jwtToken.data);
    throw new Error(jwtToken.statusText);
  }
  return jwtToken;
}