import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import userReducer from './components/userReducer';
import scheduleReducer from './components/scheduleReducer';

const loggerMiddleware = createLogger();
const rootReducer = combineReducers({
	userReducer,
	scheduleReducer
});

export default function configureStore(preloadedState) {
  return createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(
      thunkMiddleware,
      loggerMiddleware
    )
  );
}
