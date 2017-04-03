import React, { Component } from 'react';
import { connect } from 'react-redux';

import AppBar from 'material-ui/AppBar';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import LogoButton from '../dummy/LogoButton';
import LoggedInMenu from '../dummy/LoggedInMenu';
import LoggedOutMenu from '../dummy/LoggedOutMenu';

class Header extends Component {

	render() {
		const userId = this.props.currentUser.id;
		return(
			<div>
				<div style={{ clear: 'both', padding: '0 20px 20px' }}>
					<LogoButton />
					{ !!userId? <LoggedInMenu /> : <LoggedOutMenu /> }
				</div>

				{ this.props.children }
			</div>
		);
	}

}

function mapStateToHeader(state) {
	// console.log(state);
	const { currentUser } = state.userReducer;
	return { currentUser };
}

export default connect(mapStateToHeader)(Header)

