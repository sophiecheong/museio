import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';

import profileStyle from './profileStyle';
import ProfileImage from '../dummy/ProfileImage';
import VerifiedIcon from '../dummy/VerifiedIcon';
import StarRating from '../dummy/StarRating';
import Schedules from '../schedule/Schedules';

import userAction from '../userAction';

class Profile extends Component {
	constructor(props) {
		super();

		this.renderMetrics = this.renderMetrics.bind(this);
	}

	componentDidMount() {
		const { dispatch, currentUser } = this.props;
		const userId = "me" == this.props.params.userId ? currentUser.id : this.props.params.userId;
		dispatch(userAction.getUser(userId, "me" == this.props.params.userId));
	}

	renderMetrics() {
		const metrics = this.props.metrics;
		const viewingUser = "me" == this.props.params.userId ? this.props.currentUser : this.props.user;
		const isTeacher = 1 == viewingUser.status;
		return(
			<div>
				<Subheader> { isTeacher ? "Reviews" : "Reviews Made" } </Subheader>
				{ metrics.map(function(metric) {
					const user = isTeacher ? metric.reviewer : metric.reviewee;
					return(
						<div style={{ overflow: "auto" }} key={ metric.id } >
							<ProfileImage profImage={ user.profImage } width="15%" />
							<div style={{ float: "left", margin: "0 5%", width: "70%" }}>
								<Link to={ "/profile/" + user.id } > 
									<h4 style={ profileStyle.name }>
										{ user.firstName } { user.lastName }
									</h4>
								</Link>
								<Subheader style={ profileStyle.metricRating }> 
									<StarRating stars={ metric.avgRating } />
									{ metric.dateCreated.toLocaleDateString() }
								</Subheader>
								<span style={ profileStyle.bio }> 
									{ metric.review }
								</span>
							</div>
						</div>
					)
				}) }
			</div>
		);
	}

	render() {
		const user = "me" == this.props.params.userId ? this.props.currentUser : this.props.user;
		const isTeacher = 1 == user.status;
		return(
			<div>
				<Paper style={ profileStyle.accountContainer } >
					<ProfileImage profImage={ user.profImage } width="15%" />
					<div style={{ float: "left", margin: "0 5%", width: "70%" }}>
						<h2 style={ profileStyle.name }>
							{ user.firstName } { user.lastName }
							{ (user.verify && isTeacher) && <VerifiedIcon /> }
						</h2>
						<Subheader style={ profileStyle.location }> 
							{ (user.avgRating && isTeacher) && <StarRating stars={ user.avgRating } /> } &middot; &nbsp;
							{ user.mLocation } &middot; &nbsp;
							{ (user.hrRate && isTeacher) && "$" + user.hrRate + "/hour" }
						</Subheader>
						<span style={ profileStyle.bio }> { user.bio } </span>
					</div>
				</Paper>
				<div style={ profileStyle.metricsContainer }>
					<Paper style={ profileStyle.fullWidthPaper } >
						{
							!!this.props.metrics ? this.renderMetrics() : <Subheader> Loading... </Subheader>
						}
					</Paper> 
				</div>
				<div style={ profileStyle.rightContainer } >
					<Paper style={ profileStyle.fullWidthPaper } >
						<Subheader> Instruments </Subheader>
						{ 
							!! user.instruments && !!user.instruments.length ?
							user.instruments.map(function(instrument) {
								return (
									<div key={ instrument.instr }> 
										{ instrument.instr } &mdash; { instrument.cert } 
									</div>
								);
							}) :
							<div> There are no instruments to show </div>
						}
					</Paper>
				</div>
				<div style={ isTeacher ? profileStyle.rightContainer : { display: 'none' }} >
					<Paper style={ profileStyle.fullWidthPaper } >
						<Subheader> Schedule </Subheader>
						<Schedules userId={ user.id } /> 
					</Paper>
				</div>

			</div>
		);
	}
}


function mapStateToProfile(state) {
	// console.log(state);
	const { currentUser, metrics, user } = state.userReducer;
	return { currentUser, metrics, user };
}

export default connect(mapStateToProfile)(Profile);
