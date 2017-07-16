import { combineReducers } from 'redux';

import {
  GOT_USER, GOT_NEW_CHAT, ALERT_ERROR,
  REQUEST_LOGIN, RECIEVE_LOGIN, LOGIN_ERROR,
  INIT_CHAT, INIT_CHAT_DATA, UNREAD_COUNT, SET_LAST_SEQ,
  PREPARE_CHAT_CREATION, END_CHAT_CREATION, GROUP_ADDED
} from '../actions/actionTypes.js';

const initialState = {
    login: { onRequest: false, status: false },
    error: {},
    user: {
        uid: '',
        name: 'guest',
        inGroups: {},
        invites: ''
    },
    chat: {
        onCreate: false
    },
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
            return {
                ...state,
                inGroups: {
                    ...state.inGroups,
                    [action.gid]: {...state.inGroups[action.gid], unreadCount: action.unreadCount}
                }

            }
        case SET_LAST_SEQ:
            inGroups = {
                ...state.inGroups,
                [action.gid]: { ...state.inGroups[action.gid], lastSeq: action.lastSeq }
            }
            return {
                ...state,
                inGroups
            }
        case GROUP_ADDED:
            return {
                ...state,
                inGroups: {
                    ...state.inGroups,
                    [action.gid]: action.group
                }
            }
        case GOT_INVITES:
            return {
                ...state,
                invites: action.gids
            }
        default:
            return state;
    }
};

const chat = (state = initialState.chat, action) => {
    let group;
    switch (action.type) {
        case INIT_CHAT:
            return {
                ...state,
                [action.gid]: action.group
            };
        case INIT_CHAT_DATA:
            group = {...state[action.gid]};
            return {
                ...state,
                [action.gid]: {
                    ...group,
                    chats: action.chats
                }
            };
        case GOT_NEW_CHAT:
            group = {...state[action.gid]};
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
        case PREPARE_CHAT_CREATION:
            return {
                ...state,
                onCreate: true
            }
        case END_CHAT_CREATION:
            return {
                ...state,
                onCreate: false
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
