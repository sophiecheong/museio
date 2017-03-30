import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import configureStore from './configureStore';
import Theme from './components/style/theme';
import componentStyles from './components/style/components';

import Header from './components/header/Header';
import About from './components/about/About';
import SignUp from './components/signup/SignUp';

const app = document.getElementById('app');
const store = configureStore();
const muiTheme = getMuiTheme(Object.assign(Theme, componentStyles));

injectTapEventPlugin();

ReactDOM.render(
    <MuiThemeProvider muiTheme={ muiTheme }>
    	<Provider store={ store }>
	        <Router history={ browserHistory }>
	            <Route path='/' component={ Header }>
	            	<IndexRoute component={ SignUp }/>
	            	<Route path="/about" component={ About } />
	            	<Route path="/register" component={ SignUp } />
	            </Route>
	        </Router>
        </Provider>
    </MuiThemeProvider>,
app);