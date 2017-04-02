import React, { Component } from 'react';
import { Link } from 'react-router';
import FlatButton from 'material-ui/FlatButton';

import Login from '../login/Login';

class LoggedOutMenu extends Component {
	render() {
		return(
			<div style={{ 'float': 'right' }}>
				<Login />
				<Link to="/register">
					<FlatButton label="Sign up" />
				</Link>
			</div>
		);
	}
}

export default LoggedOutMenu;