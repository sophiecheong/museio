import React, { Component } from 'react';
import { Link } from 'react-router';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';


class LoggedInMenu extends Component {
	render() {
		return(
			<div style={{ 'float': 'right' }}>
				<Link to="/search"> 
					<FlatButton label="Browse" />
				</Link>
				<Link to="/notifications">
					<FlatButton label="Alerts" />
				</Link>
				<Link to="/profile/me"> 
					<FlatButton label="My Profile" />
				</Link>
				<IconMenu iconButtonElement={ <IconButton><MoreVertIcon /></IconButton> } >
					<MenuItem primaryText="Settings" containerElement={<Link to="/settings" />} />
					<MenuItem primaryText="About" containerElement={<Link to="/about" />} />
					<MenuItem primaryText="Sign out" containerElement={<Link to="/signout" />}/>
				</IconMenu>
			</div>
		);
	}
}

export default LoggedInMenu;