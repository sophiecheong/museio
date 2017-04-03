import { combineReducers } from 'redux';
import userAction from './userAction';

export default combineReducers({

	currentUser: function (state = [], action) {
		switch (action.type) {
			case userAction.CURRENT_USER:
				return Object.assign({}, state, action.user);
			case userAction.CURRENT_AVG_RATING: 
				return Object.assign({}, state, action.avgRating);
			default:
				return state; //userAction.dummyUser; 
		} 
	},

	user: function (state = {}, action) {
		switch (action.type) {
			case userAction.RECEIVE_USER: 
				return Object.assign({}, state, action.user);
			case userAction.AVG_RATING: 
				return Object.assign({}, state, action.avgRating);
			default:
				return state; 
		}
	},

	searchCriteria: function(state = {}, action) {
		switch(action.type) {
			case userAction.SEARCH_CRITERIA:
				return action.criteria;
			default:
				return state;
		}
	},

	userList: function(state = [], action) {
		switch (action.type) {
			case userAction.USER_LIST:
				return action.users;
			default: 
				return state;
		}
	},

	metrics: function (state = [], action) {
		switch (action.type) {
			case userAction.METRIC_LIST:
				return action.metrics;
			default: 
				return  state; //userAction.dummyMetrics;
		}
	}
});


