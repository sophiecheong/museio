import React, { Component } from 'react';
import Paper from 'material-ui/Paper';

export default class ProfileImage extends Component {
	constructor(props) {
		super();

		this.imageUrl = !!props.profImage? props.profImage : 'http://leafii.com/images/defaultProfilePic.png';
		this.paperStyle = {
			width: props.width || '75px',
			height: '0',
			paddingBottom: props.width || '75px',
			margin: '20px 10px',
			overflow: 'hidden',
			alignItems: 'center',
			float: 'left'
		};
	}

	render() {
		return(
			<Paper style={ this.paperStyle } zDepth={2} circle={true}>
				<img src={ this.imageUrl } style={{ width: '100%' }} />
			</Paper>
		);
	}
}