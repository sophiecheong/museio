import { red500, grey500 } from 'material-ui/styles/colors';

export default {
	accountContainer: {
		width: '80%',
		margin: '0 auto',
		overflow: 'hidden',
		padding: '10px 20px',
		clear: 'both'
	},
	metricsContainer: {
		width: '49%',
		marginLeft: '10%',
		marginTop: '20px',
		float: 'left'
	},
	rightContainer: {
		width: '29%',
		marginRight: '10%',
		marginTop: '20px',
		float: 'right',
		clear: 'right'
	},
	fullWidthPaper : {
		width: '100%',
		padding: '10px 20px',
		overflow: 'hidden'
	},
	name: {
		color: red500,
		fontFamily: 'Roboto, sans-serif',
		margin: '20px 0 0'
	},
	location: {
		padding: '5px 0 0',
		lineHeight: 'normal',
		margin: '0 0 5px',
		overflow: "hidden"
	},
	metricRating: {
		padding: '0',
		lineHeight: 'normal',
		margin: '5px 0',
		overflow: "hidden"
	},
	bio: {
		fontFamily: 'Roboto, sans-serif',
		color: grey500
	}
}