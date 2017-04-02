import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';

import userAction from '../userAction';
import ProfileImage from '../dummy/ProfileImage';
import VerifiedIcon from '../dummy/VerifiedIcon';
import StarRating from '../dummy/StarRating';
import browseStyle from './browseStyle';

class Browse extends Component {
	constructor(props) {
		super();

		this.state = { updateSearch: 0 };

		this.search = {
			mLocation: props.searchCriteria.mLocation,
			instrument: props.searchCriteria.instrument,
			cert: props.searchCriteria.cert
		};

		this.handleTextChange = this.handleTextChange.bind(this);
		this.startSearch = this.startSearch.bind(this);
		this.renderUsers = this.renderUsers.bind(this);
	}

	startSearch() {
		const { dispatch } = this.props;
		dispatch(userAction.getUsers(this.search));
	}

	handleTextChange(evt) {
        var text = {};
        text[evt.target.id] = evt.target.value;
        
        this.search = Object.assign({}, this.search, text);
        this.setState({ updated: this.state.updated + 1 });
    }

	renderUsers(user) {
		return(
			<Paper style={ browseStyle.accountContainer } key={ user.id } >
				<ProfileImage profImage={ user.profImage } width="15%" />
				<div style={{ float: "left", margin: "0 2%", width: "70%" }}>
					<h3 style={ browseStyle.name }>
						<Link to={ "/profile/" + user.id } style={ browseStyle.linkColor } > 
							{ user.firstName } { user.lastName }
						</Link>
						{ (user.verify) && <VerifiedIcon /> }
					</h3>
					<Subheader style={ browseStyle.location }> 
						{ user.mLocation } &middot; &nbsp;
						{ (user.hrRate) && "$" + user.hrRate + "/hour" }
					</Subheader>
					<div style={ browseStyle.bio }> { user.bio } </div>
				</div>
			</Paper>
		);
	}

	render() {
		const canSearch = !!this.search.instrument && !!this.search.mLocation;
		const that = this;
		return(
			<div style={ browseStyle.container } >
				<Paper style={ browseStyle.paperContainer }> 
					<TextField id="mLocation" key="mLocation"
                        value={ this.search.mLocation }
                        floatingLabelText="Location"
                        hintText="Enter a location"
                        style={ browseStyle.searchItem }
                        onChange={ this.handleTextChange } />
	                <TextField id="instrument" key="instrument"
                        value={ this.search.instrument }
                        floatingLabelText="Instrument"
                        style={ browseStyle.searchItem }
                        hintText="Enter an instrument"
                        onChange={ this.handleTextChange } />
	                <TextField id="cert" key="cert"
                        value={ this.search.cert }
                        floatingLabelText="Cert Level"
                        hintText="Enter a cert level"
                        style={ browseStyle.searchItem }
                        onChange={ this.handleTextChange } />
	                <RaisedButton
                        label="Search"
                        primary={ true }
                        disabled={ !canSearch }
                        onTouchTap={ this.startSearch } />
				</Paper>
				<div style={{ width: "95%", margin: "0 auto" }}>
					{ !!this.props.userList ? 
						this.props.userList.map(that.renderUsers) :
						<Subheader style={{ textAlign: "center" }} > Loading... </Subheader>
					}
				</div>
			</div>
		);
	}
}

function mapStateToBrowse(state) {
	console.log(state);
	const { userList, searchCriteria } = state.userReducer;
	return { userList, searchCriteria };
}

export default connect(mapStateToBrowse)(Browse);
