import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';

import userAction from '../userAction';

import Login from '../login/Login';
import landingStyle from './landingStyle';

class LandingPage extends Component {
	constructor(props) {
		super();

		this.state = { updated: 0 };

		this.search = {
			mLocation: props.currentUser.mlocation || "Toronto",
			instrument: '',
			cert: ''
		};

		this.handleTextChange = this.handleTextChange.bind(this);
		this.startSearch = this.startSearch.bind(this);
	}

	startSearch() {
		const { dispatch } = this.props;
		dispatch(userAction.getUsers(this.search));
		this.props.router.push('/browse');
	}

	handleTextChange(evt) {
        var text = {};
        text[evt.target.id] = evt.target.value;
        
        this.search = Object.assign({}, this.search, text);
        this.setState({ updated: this.state.updated + 1 });
    }

	render() {
		const isLoggedIn = !!this.props.currentUser.id;
		const canSearch = !!this.search.instrument && !!this.search.mLocation;

		return(
			<div style={ landingStyle.container } >
				<h1 style={ landingStyle.headerContainer } >
					<span style={ landingStyle.coloredHeader }> Looking for someone? </span>
					<br />
					<span style={ landingStyle.header }> Let us help you! </span> 
				</h1>

				<Paper style={ landingStyle.paperContainer } >
					<TextField id="mLocation" key="mLocation"
	                        value={ this.search.mLocation }
	                        floatingLabelText="Location"
	                        hintText="Enter a location"
	                        style={ landingStyle.searchItem }
	                        onChange={ this.handleTextChange } />
	                <TextField id="instrument" key="instrument"
	                        value={ this.search.instrument }
	                        floatingLabelText="Instrument"
	                        style={ landingStyle.searchItem }
	                        hintText="Enter an instrument"
	                        onChange={ this.handleTextChange } />
	                <TextField id="cert" key="cert"
	                        value={ this.search.cert }
	                        floatingLabelText="Cert Level"
	                        hintText="Enter a cert level"
	                        style={ landingStyle.searchItem }
	                        onChange={ this.handleTextChange } />
	                {
	                	!!this.props.currentUser.id ?
		                	<RaisedButton
		                        label="Search"
		                        primary={ true }
		                        disabled={ !canSearch }
		                        onTouchTap={ this.startSearch } /> :
		                	<Login raisedBtn={ true } />
	                }
				</Paper>
                <img src="../../images/landingpage-banner.jpg" style={ landingStyle.banner } />
			</div>
		);
	}
}

function mapStateToLandingPage(state) {
	console.log(state);
	const { currentUser } = state.userReducer;
	return { currentUser };
}

export default connect(mapStateToLandingPage)(LandingPage);
