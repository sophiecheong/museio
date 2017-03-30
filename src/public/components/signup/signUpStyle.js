import { grey300, grey800 } from 'material-ui/styles/colors';

export default {

	btnContainer: {
		margin: '10px 10%',
		clear: 'both',
		float: 'right'
	},
	contentContainer: {
		margin: '10px'
	},
	profileContainer: {
		width: '75%',
		margin: '0 auto',
		padding: '0 20px',
		overflow: 'hidden',
		position: 'relative'
	},
	stepHeader: {
	    textAlign: 'center',
	    margin: '10px 0 20px',
	    fontFamily: 'Roboto, sans-serif',
	    fontSize: 'larger',
	    color: grey800
	},
	fadeDiv: {
		width: '100%',
		height: '100%',
		position: 'absolute',
		backgroundColor: 'rgba(255, 255, 255, 0.5)',
		top: 0,
		cursor: 'pointer'
	},
	hide: {
		display: 'none'
	},
	icon: {
		width: '50%'
	},
	stepper: {
		width: '66%',
		margin: '0 auto'
	},
	studentContainer: {
		float: 'right',
		width: '48%',
		fontFamily: 'Roboto, sans-serif',
		textAlign: 'center',
		position: 'relative',
		color: grey800
	},
	teacherContainer: {
		float: 'left',
		width: '48%',
		fontFamily: 'Roboto, sans-serif',
		textAlign: 'center',
		position: 'relative',
		color: grey800
	},
	vertLine: {
		borderLeft: `1px solid ${ grey300 }`,
		height: '300px',
		float: 'left'
	},
	profileItems: {
		miniContainer: {
			clear: 'both',
			margin: '0 0 10px',
			overflow: 'hidden'
		},
		leftItem: {
			width: '49%',
			float: 'left'
		},
		rightItem: {
			width: '49%',
			float: 'right'
		},
		fullItem: {
			width: '100%',
			float: 'left'
		},
		profImage: {
			width: '30%',
			height: '0',
			paddingBottom: '30%',
			margin: '20px 10px',
			overflow: 'hidden',
			alignItems: 'center'
		},
		profText: {
			width: '60%',
			position: 'absolute',
			bottom: '33%',
			right: '3%'
		},
		divider: {
			margin: '0 auto',
			marginTop: '0',
			marginLeft: 'auto',
			marginBottom: '0',
			marginRight: 'auto',
			width: '50%'
		}
	}
};