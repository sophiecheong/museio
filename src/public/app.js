import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, hashHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import configureStore from './configureStore';
import Header from './components/header/Header';
import Theme from './components/style/theme';
import componentStyles from './components/style/components';
import SignUp from './components/signup/SignUp';

const app = document.getElementById('app');
const store = configureStore();
const muiTheme = getMuiTheme(Object.assign(Theme, componentStyles));

injectTapEventPlugin();

//<IndexRoute component={Home}/>

ReactDOM.render(
    <MuiThemeProvider muiTheme={ muiTheme }>
    	<Provider store={ store }>
	        <Router history={ hashHistory }>
	            <Route path='/' component={ Header }>
	            	<Route path="/register" component={ SignUp } />
	            </Route>
	        </Router>
        </Provider>
    </MuiThemeProvider>,
app);