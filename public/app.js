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
import EmptyParentComponent from './components/dummy/EmptyParentComponent';
import About from './components/about/About';
import SignUp from './components/signup/SignUp';
import Settings from './components/settings/Settings';
import Profile from './components/profile/Profile';
import EditProfile from './components/profile/EditProfile';
import EditInstruments from './components/profile/EditInstruments';

const app = document.getElementById('app');
const store = configureStore();
const muiTheme = getMuiTheme(Object.assign(Theme, componentStyles));

injectTapEventPlugin();

ReactDOM.render(
    <MuiThemeProvider muiTheme={ muiTheme }>
    	<Provider store={ store }>
	        <Router history={ browserHistory }>
	            <Route path='/' component={ Header }>
	            	<IndexRoute component={ Profile }/>
	            	<Route path="/about" component={ About } />
	            	<Route path="/register" component={ SignUp } />
	            	<Route path="/profile/:userId" component={ Profile } />
	            	<Route path="/settings" component={ Settings } >
	            		<IndexRoute component={ EditProfile } />
	            		<Route path="/settings/profile" component={ EditProfile } />
	            		<Route path="/settings/instruments" component={ EditInstruments } />
	            	</Route>
	            </Route>
	        </Router>
        </Provider>
    </MuiThemeProvider>,
app);