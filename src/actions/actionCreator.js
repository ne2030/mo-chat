import firebase from '../config.js';


/*
* login & signup
*/

const requestLogin = () => ({
    type: 'REQUEST_LOGIN'
});

const recieveLogin = () => ({
    type: "RECIEVE_LOGIN"
});

const gotUser = (user, uid) => ({
    type: 'GOT_USER',
    user,
    uid
});

const loginError = () => ({
    type: "LOGIN_ERROR"
});

const signupError = () => ({
    type: "SIGNUP_ERROR"
});

/*
* error
*/

export const alertError = err => {
    alert(err.message);
    return ({
        type: 'ALERT_ERROR',
        message: err.message,
        stack: err.stack
    });
};

/*
* initialize & update user info
*/

const setUnreadCount = (gid, unreadCount) => ({
    type: 'UNREAD_COUNT',
    gid,
    unreadCount
});

const setLastSeq = (seq, gid) => ({
    type: 'SET_LAST_SEQ',
    lastSeq: seq,
    gid
});

const initChat = (group, gid) => ({
    type: 'INIT_CHAT',
    group,
    gid
});

const initChatData = (chats, gid) => ({
    type: 'INIT_CHAT_DATA',
    chats,
    gid
});

const gotNewChat = (message, chatId, gid) => ({
    type: 'GOT_NEW_CHAT',
    message,
    chatId,
    gid
});

/*
* chat room
*/

export const prepareChatCreation = () => ({
    type: "PREPARE_CHAT_CREATION"
});

export const endChatCreation = () => ({
    type: "END_CHAT_CREATION"
});

const groupAdded = (gid, group) => ({
    type: "GROUP_ADDED",
    gid,
    group
});

const gotInvites = (gids) => ({
    type: "GOT_INVITES",
    gids
});

/*
*
* thunk action creator
*
*/

export const getUser = (userConn, uid) => (dispatch, getState) => {
    // invite check
    firebase.database().ref(`invites/${uid}`).on('value', data => {
        let gids = data.val() ? Object.values(data.val()) : '';
        dispatch(gotInvites(gids));
    })
    // user snapshot
    return userConn.once('value')
        .then(snapshot => {
            let userInfo = snapshot.val();
            dispatch(gotUser(userInfo, uid));
            // 채팅방 메타데이터 및 채팅 목록 조회
            for(let gid in userInfo.inGroups) {
                let inGroup = userInfo.inGroups[gid];
                firebase.database().ref(`groups/${gid}`).once('value')
                    .then(data => {
                        let group = data.val();
                        dispatch(initChat(group, gid));
                    });
                let chatConn = firebase.database().ref(`chats/${gid}`);
                // 최초 100개 조회, 이후 추가 데이터를 계속 수신하면서 업데이트
                chatConn.limitToLast(100).once('value')
                    .then(data => {
                        let chats = data.val();
                        dispatch(initChatData(chats, gid));

                        chatConn.limitToLast(1).on('value', data => {
                            let chatId = Object.keys(data.val())[0]
                            let last = data.val()[chatId];
                            // last seq 기록하는 거 제일 먼저
                            dispatch(setLastSeq(last.seq, gid));
                            let unreadCount = last.seq - inGroup.lastCheck;
                            dispatch(setUnreadCount(gid, unreadCount));
                            dispatch(gotNewChat(last, chatId, gid));
                        });
                    })
                    .catch(err => dispatch(alertError(err)));
            }
        })
        .catch(err => {
            console.log(err);
            dispatch(alertError(err));
        });
};

export const login = ({id, password}) => dispatch => {
    dispatch(requestLogin());
    return firebase.auth().signInWithEmailAndPassword(id, password)
        .then(({uid}) => {
            let userConn = firebase.database().ref(`users/${uid}`);
            dispatch(recieveLogin());
            dispatch(getUser(userConn, uid));
        })
        .catch(err => {
            dispatch(alertError(err));
            dispatch(loginError());
        });
};

export const signup = ({id, password, name}) => dispatch => {
    return firebase.auth().createUserWithEmailAndPassword(id, password)
        .then(({uid}) => {
            firebase.database().ref(`users/${uid}`).set({
                name: name
            });
            firebase.database().ref(`users/list/${uid}`).set(name)
                .catch(err => dispatch(alertError()));
            dispatch(gotUser({name}, uid))
            dispatch(recieveLogin());
        })
        .catch(err => {
            dispatch(alertError(err));
            dispatch(signupError());
        })
}

export const createChatRoom = (inviteFriends, name) => (dispatch, getState) => {
    const user = getState().user;
    return firebase.database().ref('groups').push({
        name,
        users: {
            [user.uid]: user.name
        }
    }).then((result) => {
            // 초대된 친구들에게 invite 전송
            const gid = result.path.o[1];
            inviteFriends.forEach(uid => {
                firebase.database().ref(`invites/${uid}`).push({
                    gid,
                    name,
                    user: user.name
                });
            });
            // 자신의 inGroups 에 그룹 추가
            let initialState = {
                lastCheck: 0,
                name
            };
            firebase.database().ref(`users/${user.uid}/inGroups/${gid}`).set(initialState)
                .then(() => {
                    dispatch(groupAdded(gid, initialState));
                });

            // 초기 메세지 발송
            let time = new Date();
            let timestamp = `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`;
            firebase.database().ref(`chats/${gid}`).push({
                message: '채팅방이 생성되었습니다.',
                seq: 0,
                timestamp,
                uid: user.uid,
                user: user.name
            }).then(() => {
                firebase.database().ref(`chats/${gid}`).limitToLast(1).on('value', data => {
                    let chatId = Object.keys(data.val())[0]
                    let last = data.val()[chatId];
                    // last seq 기록하는 거 제일 먼저
                    dispatch(setLastSeq(last.seq, gid));
                    let unreadCount = last.seq - initialState.lastCheck;
                    dispatch(setUnreadCount(gid, unreadCount));
                    dispatch(gotNewChat(last, chatId, gid));
                });
            });
            dispatch(endChatCreation())
        });
}

export const recieveInvite = (invites) => (dispatch, getState) => {
    const user = getState().user;

    for(let gid in invites) {
        if(!invites[gid].value) continue;
        firebase.database().ref(`groups/${gid}/users/${user.uid}`).set(user.name)
            .then(() => {
                let initialState = {
                    lastCheck: 0,
                    name: invites[gid].name
                };
                firebase.database().ref(`users/${user.uid}/inGroups/${gid}`).set(initialState);
                dispatch(groupAdded(gid, initialState));
                firebase.database().ref(`chats/${gid}`).limitToLast(1).on('value', data => {
                    let chatId = Object.keys(data.val())[0]
                    let last = data.val()[chatId];
                    // last seq 기록하는 거 제일 먼저
                    dispatch(setLastSeq(last.seq, gid));
                    let unreadCount = last.seq - initialState.lastCheck;
                    dispatch(setUnreadCount(gid, unreadCount));
                    dispatch(gotNewChat(last, chatId, gid));
                });
                firebase.database().ref(`invites/${user.uid}`).remove();
            });
    }
}
