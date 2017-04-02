import { combineReducers } from 'redux';
import userAction from './userAction';

export default combineReducers({

	currentUser: function (state = userAction.dummyUser, action) {
		switch (action.type) {
			case userAction.CURRENT_USER:
				return Object.assign({}, state, action.user);
			case "Receive rating": 
				return Object.assign({}, state, action.avgRating);
			default:
				return userAction.dummyUser; //state
		} 
	},

	metrics: function (state = userAction.dummyMetrics, action) {
		switch (action.type) {
			case 'receive':
				return [];
			default: 
				return userAction.dummyMetrics; //state
		}
	}
});


