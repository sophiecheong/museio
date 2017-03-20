import React, { Component } from 'react';
import { Link } from 'react-router';
import FlatButton from 'material-ui/FlatButton';

class LoggedInMenu extends Component {
	render() {
		return(
			<div style={{ 'float': 'right' }}>
				<Link to="/login"> 
					<FlatButton label="Log In" primary={true} />
				</Link>
				<Link to="/register">
					<FlatButton label="Sign up" primary={true} />
				</Link>
			</div>
		);
	}
}

export default LoggedInMenu;