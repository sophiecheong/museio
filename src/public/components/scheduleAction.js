import axios from 'axios';

export default class scheduleAction {
	static get CURRENT_SCHEDULE() { return 'CURRENT_SCHEDULE' };

	static get dummySchedules() {
		var date = new Date();
		return [{
			id: "9090909",
			AccountId: "something",
			startTime: "9:30", 
			endTime: "10:30",
			date: date, 
			repeats: 2, 
			avaliable: true
		},{
			id: "9090910",
			AccountId: "something",
			startTime: "9:30", 
			endTime: "10:30",
			date: date.setDate(date.getDate() + 7), 
			repeats: 1, 
			avaliable: true
		},{
			id: "9090911",
			AccountId: "something",
			startTime: "9:30", 
			endTime: "10:30",
			date: date.setDate(date.getDate() + 14), 
			repeats: 0, 
			avaliable: true
		},{
			id: "9090912",
			AccountId: "something",
			startTime: "9:30", 
			endTime: "10:30",
			date: date.setDate(date.getDate() + 1), 
			repeats: 4, 
			avaliable: true
		}]
	}

	static receiveCurrentSchedules(schedules) {
		return {
			type: this.CURRENT_SCHEDULE,
			schedules
		}
	}


}