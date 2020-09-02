import { combineReducers, createStore } from 'redux';
import userEventsReducer from './user-events';
import recordReducer from './recorder';

const rootReducer = combineReducers({
    userReducer: userEventsReducer,
    recorder: recordReducer
});

export type RootState = ReturnType<typeof rootReducer>;

const store = createStore(rootReducer);

export default store;