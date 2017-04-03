import React, { Component } from 'react';
import StarIcon from 'material-ui/svg-icons/toggle/star';
import EmptyStarIcon from 'material-ui/svg-icons/toggle/star-border';
import HalfStarIcon from 'material-ui/svg-icons/toggle/star-half';

import Theme from '../style/theme';

export default class StarRating extends Component {
	render() {
		const stars = this.props.stars.toString().split(".");
		const numFilled = parseInt(stars[0]);
		const numHalf = 5 == parseInt(stars[1]) ? 1 : 0;
		const numEmpty = 5 - numHalf - numFilled;

		return(
			<div style={{ float: "left", clear: "both", width: "25%", margin: "-5px 5px 0 0", maxWidth: "110px" }} >
				{ 1 <= numFilled && <StarIcon color={Theme.palette.primary1Color} style={{ width: '20%' }} /> }
				{ 2 <= numFilled && <StarIcon color={Theme.palette.primary1Color} style={{ width: '20%' }} /> }
				{ 3 <= numFilled && <StarIcon color={Theme.palette.primary1Color} style={{ width: '20%' }} /> }
				{ 4 <= numFilled && <StarIcon color={Theme.palette.primary1Color} style={{ width: '20%' }} /> }
				{ 5 <= numFilled && <StarIcon color={Theme.palette.primary1Color} style={{ width: '20%' }} /> }
				{ 1 == numHalf && <HalfStarIcon color={Theme.palette.primary1Color} style={{ width: '20%' }} /> }
				{ 1 <= numEmpty && <EmptyStarIcon color={Theme.palette.primary1Color} style={{ width: '20%' }} /> }
				{ 2 <= numEmpty && <EmptyStarIcon color={Theme.palette.primary1Color} style={{ width: '20%' }} /> }
				{ 3 <= numEmpty && <EmptyStarIcon color={Theme.palette.primary1Color} style={{ width: '20%' }} /> }
				{ 4 <= numEmpty && <EmptyStarIcon color={Theme.palette.primary1Color} style={{ width: '20%' }} /> }
				{ 5 <= numEmpty && <EmptyStarIcon color={Theme.palette.primary1Color} style={{ width: '20%' }} /> }
			</div>
		);
	}
}