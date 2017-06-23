import { combineReducers } from 'redux';

import {
  GOT_USER, GOT_NEW_CHAT, ALERT_ERROR, REQUEST_LOGIN, RECIEVE_LOGIN, LOGIN_ERROR, INITIALIZE_CHAT, UNREAD_COUNT, SET_LAST_SEQ
} from '../actions/actionTypes.js';

const initialState = {
    login: { onRequest: false, status: false },
    error: {},
    user: {
        uid: '',
        name: 'guest',
        inGroups: []
    },
    chat: {},
    friends: {
        list: []
    }
};

const login = (state = initialState.login, action) => {
    switch (action.type) {
        case REQUEST_LOGIN:
            return {
                ...state,
                onRequest: true
            };
        case RECIEVE_LOGIN:
            return {
                ...state,
                onRequest: false,
                status: true
            }
        case LOGIN_ERROR:
            return {
                ...state,
                onRequest: false,
                status: false
            }
        default:
            return state;
    }
}

const error = (state = initialState.error, action) => {
    switch (action.type) {
        case ALERT_ERROR:
            return {
                ...state,
                message: action.message,
                stack: action.stack
            };
        default:
            return state;
    }
};

const user = (state = initialState.user, action) => {
    let inGroups;
    switch (action.type) {
        case GOT_USER:
            return {
                ...state,
                ...action.user,
                uid: action.uid
            };
        case UNREAD_COUNT:
            inGroups = state.inGroups.map(inGroup =>
                inGroup.gid == action.gid ? {...inGroup, unreadCount: action.unreadCount} : inGroup
            );
            return {
                ...state,
                inGroups
            }
        case SET_LAST_SEQ:
            inGroups = state.inGroups.map(inGroup =>
                inGroup.gid == action.gid ? {...inGroup, lastSeq: action.lastSeq} : inGroup
            );
            return {
                ...state,
                inGroups
            }
        default:
            return state;
    }
};

const chat = (state = initialState.chat, action) => {
    switch (action.type) {
        case INITIALIZE_CHAT:
            return {
                ...state,
                [action.gid]: action.group
            };
        case GOT_NEW_CHAT:
            let group = {...state[action.gid]};
            return {
                ...state,
                [action.gid]: {
                    ...group,
                    chats: {
                        ...group.chats,
                        [action.chatId]: action.message
                    },
                }
            }
        default:
            return state;
    }
};

const chatReducer = combineReducers({
    user,
    chat,
    error,
    login
});


export default chatReducer;
