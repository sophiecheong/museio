import React, { Component } from 'react';

export default class EmptyParentComponent extends Component {
	render() {
		return(
			<div>
				{ this.props.children }
			</div>
		)
	}
}