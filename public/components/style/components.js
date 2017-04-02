import Theme from './theme';
import { transparent } from 'material-ui/styles/colors';
import {darken, fade, emphasize, lighten} from 'material-ui/utils/colorManipulator';

export default {
	flatButton: {
		color: transparent,
		buttonFilterColor: '#999999',
		disabledTextColor: fade(Theme.palette.textColor, 0.3),
		textColor: Theme.palette.textColor,
		primaryTextColor: Theme.palette.primary1Color,
		secondaryTextColor: Theme.palette.primary3Color,
    },
}