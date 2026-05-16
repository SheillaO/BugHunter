import { EventEmitter } from "node:events";

import { createSlackAlert } from "../utils/createSlackAlert.js";

export const bugEvents = new EventEmitter();

bugEvents.on("bug-added", createSlackAlert);
