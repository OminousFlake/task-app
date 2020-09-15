import { act } from "react-dom/test-utils";
import { Action, AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import { RootState } from "./store";

interface UserEvent {
    id: number;
    title: string;
    dateStart: string;
    dateEnd: string;
}

interface UserEventsState {
    byIds: Record<UserEvent['id'], UserEvent>;
    allIds: UserEvent['id'][];
}

const eventsUrl = 'http://localhost:3001/events';
const LOAD_REQUEST = 'userEvents/load_request';
const LOAD_SUCCESS = 'useEvents/load-success';
const LOAD_FAILURE = 'useEvents/load-failure';

interface loadRequestAction extends Action<typeof LOAD_REQUEST> { }
interface loadSuccessAction extends Action<typeof LOAD_SUCCESS> {
    payload: {
        events: UserEvent[]
    }
}
interface loadFailureAction extends Action<typeof LOAD_FAILURE> {
    message: string;
}

export const loadUserEvents = (): ThunkAction<
    void,
    RootState,
    undefined,
    loadRequestAction | loadSuccessAction | loadFailureAction
> => async (dispatch, getState) => {
    dispatch({
        type: LOAD_REQUEST
    });

    try {
        const response = await fetch(eventsUrl);
        const events: UserEvent[] = await response.json();
        dispatch({
            type: LOAD_SUCCESS,
            payload: {
                events
            }
        });
    } catch (error) {
        dispatch({
            type: LOAD_FAILURE,
            message: 'Failed to load events'
        });
    }
};

const initialState: UserEventsState = {
    byIds: {},
    allIds: [],
}

const userEventsReducer = (
    state: UserEventsState = initialState,
    action: loadSuccessAction
) => {
    switch (action.type) {
        case LOAD_SUCCESS:
            const { events } = action.payload;
            return {
                ...state, allIds: events.map(id => id), byIds: events.reduce<UserEventsState['byIds']>((byIds, event) => {
                    byIds[event.id] = event;
                    return byIds;
                }, {})
            }
        default:
            return state;
    }
};

export default userEventsReducer;