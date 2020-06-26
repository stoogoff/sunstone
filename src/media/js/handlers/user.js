
import { handlerCreator } from "./base";
import { auth } from "../lib/firebase";
import { USER_LOGIN, USER_LOGIN_COMPLETE, USER_REGISTER, USER_REGISTER_ERROR } from "../lib/action-keys";

import dispatcher from "../lib/dispatcher";
import getLogger from "../lib/logger";

const logger = getLogger("user");


// wait for firebase auth state to change
auth.onAuthStateChanged(user => {
	logger.warn("onAuthStateChanged")
	logger.log(user);

	dispatcher.dispatch(USER_LOGIN_COMPLETE, user);
});






const USER_ACTIONS = {};


USER_ACTIONS[USER_LOGIN] = (state, payload) => {
	//console.log(USER_LOGIN, state, payload)

	return payload;
};

USER_ACTIONS[USER_LOGIN_COMPLETE] = (state, payload) => {
	return payload;
};

USER_ACTIONS[USER_REGISTER] = (state, payload) => {
	logger.warn(USER_REGISTER)
	logger.info(state, payload)

	// TODO connect user to any existing map

	// create a user, and pass on any errors if they occur
	auth.createUserWithEmailAndPassword(payload.email, payload.password).then(user => {
		//console.log("after create", creds)

		auth.currentUser.updateProfile({
			displayName: payload.username
		});

	}).catch(error => dispatcher.dispatch(USER_REGISTER_ERROR, error));

	return state;
};

USER_ACTIONS[USER_REGISTER_ERROR] = (state, payload) => {
	logger.error(payload);
	return {...state, error: {...payload}};
};



export default handlerCreator(USER_ACTIONS);