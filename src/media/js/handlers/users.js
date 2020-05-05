
import { handlerCreator } from "./base";
import { database } from "../lib/firebase";
import { USER_LOGIN, USER_REGISTER } from "../lib/action-keys";

import dispatcher from "../lib/dispatcher";
import getLogger from "../lib/logger";

const logger = getLogger("user");

const USER_ACTIONS = {};


USER_ACTIONS[USER_LOGIN] = (state, payload) => {
	console.log(USER_LOGIN, state, payload)

	return state;
};

USER_ACTIONS[USER_REGISTER] = (state, payload) => {
	console.log(USER_REGISTER, state, payload)

	return state;
};



export default handlerCreator(USER_ACTIONS);