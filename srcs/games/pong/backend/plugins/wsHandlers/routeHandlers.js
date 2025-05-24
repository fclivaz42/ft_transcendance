import { createWsHandler } from "./baseWsHandler.js";

const remote = (manager) => createWsHandler({ mode: 'remote', manager });
const friend_host = (manager) => createWsHandler({ mode: 'friend_host', manager });
const friend_join = (manager) => createWsHandler({ mode: 'friend_join', manager });
const local = (manager) => createWsHandler({ mode: 'local', manager });
const computer = (manager) => createWsHandler({ mode: 'computer', manager });

export default {
  remote,
  friend_host,
  friend_join,
  local,
  computer
};
