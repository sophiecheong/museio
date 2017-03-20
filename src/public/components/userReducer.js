import { combineReducers } from 'redux';

// import action

export default combineReducers({

	currentUser: function (state = {}, action) {
		switch (action) {
			case 'LOGIN':
				return { user: "user" };

			default:
				return {};
		} 
	}
});


