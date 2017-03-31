import {
  red500, red700,
  tealA200,
  grey100, grey300, grey500,
  white, darkBlack, fullBlack,
} from 'material-ui/styles/colors';
import {fade} from 'material-ui/utils/colorManipulator';
import spacing from 'material-ui/styles/spacing';

export default {
  spacing: spacing,
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: red500,
    primary2Color: red700,
    primary3Color: white,
    accent1Color: tealA200,
    accent2Color: grey100,
    accent3Color: grey500,
    textColor: darkBlack,
    alternateTextColor: white,
    canvasColor: white,
    borderColor: grey300,
    disabledColor: fade(darkBlack, 0.3),
    pickerHeaderColor: red500,
    clockCircleColor: fade(darkBlack, 0.07),
    shadowColor: fullBlack,
  }
};