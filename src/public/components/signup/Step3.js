import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';

import signUpStyle from './signUpStyle';

export default class Step3 extends Component {
	constructor(props) {
		super();

		this.state = {
			profImage: props.profImage
		};

		this.handleTextChange = this.handleTextChange.bind(this);
	}

	handleTextChange(evt) {
        var text = {};
        text[evt.target.id] = evt.target.value;
        this.setState(text);        
        this.props.updateUser(text);
    }

	render() {
		const profImage = !!this.state.profImage ? this.state.profImage : 'http://leafii.com/images/defaultProfilePic.png';

		return(
			<div>
				<Paper style={ signUpStyle.profileContainer } >
					<Paper style={ signUpStyle.profileItems.profImage } 
						zDepth={2} circle={true}>
						<img src={ profImage } style={{ width: '100%' }} />
					</Paper>

					<TextField id="profImage"
						style={ signUpStyle.profileItems.profText }
						floatingLabelText="Profile Image"
						hintText="Enter the url to your profile image"
						value={ this.state.profImage }
						onChange={ this.handleTextChange } />
				</Paper>
			</div>
		);
	}
}