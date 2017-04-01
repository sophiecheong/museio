import React, { Component } from 'react';
import { Link } from 'react-router';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import ModeEditIcon from 'material-ui/svg-icons/editor/mode-edit';
import EventNoteIcon from 'material-ui/svg-icons/notification/event-note';
import QueueMusicIcon from 'material-ui/svg-icons/av/queue-music';

import settingsStyle from './settingsStyle';
import Theme from '../style/theme';

export default class Settings extends Component {
	render() {
		const pathArray = this.props.location.pathname.split("/");
		const active = (3 == pathArray.length) ? pathArray[2] : "profile";

		return(
			<div>
				<Paper style={ settingsStyle.container }>
					<Menu menuItemStyle={{ width: "93%" }} >
						<MenuItem primaryText="Edit Profile" 
							containerElement={<Link to="/settings/profile" />} 
							rightIcon={ <ModeEditIcon color={active == "profile" && Theme.palette.primary1Color } /> } />
						<MenuItem primaryText="Instruments" 
							containerElement={<Link to="/settings/instruments" />} 
							rightIcon={ <QueueMusicIcon color={ active == "instruments" && Theme.palette.primary1Color } /> } />
						<MenuItem primaryText="Schedule" 
							containerElement={<Link to="/settings/schedule" />} 
							rightIcon={ <EventNoteIcon color={ active == "schedule" && Theme.palette.primary1Color } /> } />
					</Menu>
				</Paper>

				{ this.props.children }
			</div>
		);
	}
}
