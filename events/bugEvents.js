import { EventEmitter } from "node:events";
// 1. Point to the correct file name that exists in your utils folder
import { createSlackAlert } from "../utils/createSlackAlert.js";

// 2. Rename variable to match your updated routing logic
export const bugEvents = new EventEmitter();

// 3. Listen for the correct platform hook name
bugEvents.on("bug-added", createSlackAlert);
