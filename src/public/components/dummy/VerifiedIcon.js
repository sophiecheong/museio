import React, { Component } from 'react';
import DoneIcon from 'material-ui/svg-icons/action/done';

import Theme from '../style/theme';

export default class VerifiedIcon extends Component {
	render() {
		const spanStyle = { 
			color: Theme.palette.accent1Color, 
			marginLeft: '20px', 
			fontSize: '15px' 
		};

		return(
			<span style={ spanStyle } >
				<DoneIcon color={ Theme.palette.accent1Color } style={{ width: '20px', height: '20px'}} />
				Verified
			</span>
		);
	}
}