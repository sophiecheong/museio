import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';

import signUpStyle from './signUpStyle';

export default class Step4 extends Component {
	constructor(props) {
		super();
	}

	render() {
		return(
			<div style={ signUpStyle.profileContainer } >
				<Subheader>
					Thank you for signing up.
				</Subheader>
			</div>
		);
	}
}