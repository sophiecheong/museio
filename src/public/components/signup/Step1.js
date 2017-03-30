import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import signUpStyle from './signUpStyle';

export default class Step1 extends Component {
	constructor(props) {
		super();

		this.userRole = props.role;
		this.insertFilter = this.insertFilter.bind(this);
		this.updateUser = this.updateUser.bind(this);
		this.updateFilter = this.updateFilter.bind(this);
	}

	componentDidMount() {
		this.updateFilter(this.userRole);
	}

	insertFilter(e) {
		const isTeacherActivated = 1 == this.userRole && 'teacher-fade' == e.target.id;
		const isStudentActivated = 2 == this.userRole && 'student-fade' == e.target.id;

		if(!isTeacherActivated && !isStudentActivated) 
			e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
		
	}

	removeFilter(e) {
		e.target.style.backgroundColor = 'rgba(255, 255, 255, 0)'; 
	}

	updateFilter(role) {
		const teacher = document.getElementById('teacher-fade');
		const student = document.getElementById('student-fade');

		if(2 == role) {
			teacher.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
			student.style.backgroundColor = 'rgba(255, 255, 255, 0)';
		} else if(1 == role) {
			teacher.style.backgroundColor = 'rgba(255, 255, 255, 0)';
			student.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';		}
	}

	updateUser(role) {
		this.updateFilter(role);
		this.userRole = role;
		this.props.updateUser({ status: role });
	}

	render() {
		return(
			<div>
				<div style={ signUpStyle.stepHeader } >
					Are you a teacher or a student?
				</div>

				<div style={ signUpStyle.teacherContainer } >
					I am a teacher!
					<br />
					<img src='../../images/teacher-icon.png' style={ signUpStyle.icon } />
					<div id="teacher-fade" 
						style={ signUpStyle.fadeDiv }
						onMouseOver={ this.removeFilter }
						onMouseOut={ this.insertFilter }
						onClick={ () => this.updateUser(1) } ></div>
				</div>
				<div style={ signUpStyle.vertLine }></div>
				<div style={ signUpStyle.studentContainer } >
					I am a student!
					<br />
					<img src='../../images/student-icon.png' 
						style={ signUpStyle.icon } />
					<div id="student-fade" 
						style={ signUpStyle.fadeDiv }
						onMouseOver={ this.removeFilter }
						onMouseOut={ this.insertFilter }
						onClick={ () => this.updateUser(2) } ></div>
				</div>
			</div>
		);
	}
}