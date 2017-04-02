import { combineReducers } from 'redux';
import scheduleAction from './scheduleAction';

export default combineReducers({

	currentSchedules: function (state = scheduleAction.dummySchedules, action) {
		switch (action.type) {
			case scheduleAction.CURRENT_SCHEDULE:
				return action.schedules;
			default:
				return scheduleAction.dummySchedules; //state;
		} 
	}
});


