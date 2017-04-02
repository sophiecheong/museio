import { red500, grey500 } from 'material-ui/styles/colors';

export default {
	container: { 
		width: "100%", 
		paddingBottom: "20px", 
		overflow: "hidden",
	},
	paperContainer: {
		width: "95%",
		padding: "1% 2%",
		textAlign: "center",
		margin: "0 auto 20px auto"
	},
	accountContainer: {
		width: '31%',
		margin: '0 1%',
		overflow: 'hidden',
		padding: '10px 20px',
		textAlign: "left",
		display: "inline-block"
	},
	searchItem: {
		width: "27%",
		marginRight: "1%"
	},
	name: {
		color: red500,
		fontFamily: 'Roboto, sans-serif',
		margin: '20px 0 0'
	},
	linkColor: {
		color: red500
	},
	location: {
		padding: '5px 0 0',
		lineHeight: 'normal',
		margin: '0 0 5px',
		overflow: "hidden"
	},
	bio: {
		fontFamily: 'Roboto, sans-serif',
		color: grey500,
		height: "40px",
		whiteSpace: "nowrap",
		overflow: "hidden",
		textOverflow: "ellipsis"
	}
}