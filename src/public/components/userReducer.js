import { combineReducers } from 'redux';
import userAction from './userAction';

export default combineReducers({

	currentUser: function (state = userAction.dummyUser, action) {
		switch (action.type) {
			case userAction.CURRENT_USER:
				return action.user;
			default:
				return userAction.dummyUser;
		} 
	}
});


