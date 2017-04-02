import React, { Component } from 'react';
import { Link } from 'react-router';
import IconButton from 'material-ui/IconButton';
import MusicNoteIcon from 'material-ui/svg-icons/image/music-note';

import Theme from '../style/theme';

class LogoButton extends Component {
	render() {
		return(
			<Link to="/"> 
				<MusicNoteIcon color={ Theme.palette.primary1Color }
								style={{ width: '40px', height: '40px'}} />
			</Link>
		);
	}
}

export default LogoButton;