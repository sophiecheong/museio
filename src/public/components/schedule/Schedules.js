import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Subheader from 'material-ui/Subheader';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';

BigCalendar.setLocalizer(
	BigCalendar.momentLocalizer(moment)
);

class Schedules extends Component {
	constructor(props) {
		super();

		this.renderSchedule = this.renderSchedule.bind(this);
		this.formatEvents = this.formatEvents.bind(this);
	}

	componentDidMount() {
		//Call get schedules for this.props.userId
	}

	formatEvents() {
		var events = []

		this.props.currentSchedules.forEach(function(schedule){
			const date = new Date(schedule.date);
			const time = schedule.startTime.split(":");
			var startDate = new Date(schedule.date).setHours(time[0]);
			startDate = new Date(startDate).setMinutes(time[1]);
			var endDate = new Date(schedule.date).setHours(parseInt(time[0]) + 1);
			endDate = new Date(endDate).setMinutes(time[1]);
			const ev = {
				title: 'Some Event',
			    start: new Date(startDate),
			    end: new Date(endDate)
			}
			events.push(ev);
		});

		return events
	}

	renderSchedule() {
		const events = this.formatEvents();
		return(
			<div>
				<BigCalendar events={ events }
			        step={ 30 }
			        timeslots={ 2 }
			        views={ ['day'] }
			        defaultView='day'
			        defaultDate={ new Date() } />
			</div>
		);
	}

	render() {
		return(
			<div>
				{ !!this.props.currentSchedules ? 
					this.renderSchedule() :
				    <Subheader> Loading... </Subheader> 
				}
			</div>
		);
	}
}

function mapStateToSchedules(state) {
	// console.log(state);
	const { currentSchedules } = state.scheduleReducer;
	return { currentSchedules };
}

export default connect(mapStateToSchedules)(Schedules);