

const requestLogin = () => ({
    type: 'REQUEST_LOGIN'
});

const recieveLogin = () => ({
    type: "RECIEVE_LOGIN"
});

const loginError = () => ({
    type: "LOGIN_ERROR"
});

export const alertError = err => {
    alert(err.message);
    return ({
        type: 'ALERT_ERROR',
        message: err.message,
        stack: err.stack
    });
};

export const gotUser = (user, uid) => ({
    type: 'GOT_USER',
    user,
    uid
});

// export const gotFriends =

export const unreadCount = ({gid, unreadCount}) => ({
    type: 'UNREAD_COUNT',
    gid,
    unreadCount
});

export const setLastSeq = (seq, gid) => ({
    type: 'SET_LAST_SEQ',
    lastSeq: seq,
    gid
})

export const getUser = (user, firebase, uid) => dispatch => {
    return user.once('value')
        .then(snapshot => {
            let userInfo = snapshot.val();
            dispatch(gotUser(userInfo, uid));
            userInfo.inGroups.forEach(inGroup => {
                firebase.database().ref(`groups/${inGroup.gid}`).once('value')
                .then(data => {
                    let group = data.val();

                    firebase.database().ref(`chats/${inGroup.gid}`).limitToLast(100).once('value')
                        .then(data => {
                            let chats = data.val();
                            group.chats = chats;
                            dispatch(initializeChat(group, inGroup.gid));

                            firebase.database().ref(`chats/${inGroup.gid}`).limitToLast(1).on('value', data => {
                                let key = Object.keys(data.val())[0]
                                let last = data.val()[key];
                                // last seq 기록하는 거 제일 먼저
                                dispatch(setLastSeq(last.seq, inGroup.gid));
                                inGroup.unreadCount = last.seq - inGroup.lastCheck;
                                dispatch(unreadCount(inGroup));
                                dispatch(gotNewChat(last, key, inGroup.gid));
                                firebase.database().ref('users').once('value', data => {
                                    let friends = [];
                                    let users = data.val();
                                    for(let id in users) {
                                        if(id !== uid) {
                                            friends.push(Object.assign({}, {uid: users[id]}));
                                        }
                                    }
                                    // dispatch(gotFriends(friends));
                                });
                            });
                        })

                    })
                    .catch(err => dispatch(alertError(err)));
            });
        })
        .catch(err => {
            console.log(err);
            dispatch(alertError(err));
        });
};

export const login = ({firebase, id, password}) => dispatch => {
    let [id, password] = ['erguono@naver.com', 'rudgnstls2'];
    dispatch(requestLogin());
    return firebase.auth().signInWithEmailAndPassword(id, password)
        .then((result) => {
            dispatch(recieveLogin());
            dispatch(getUser(firebase.database().ref(`users/${result.uid}`), firebase, result.uid));
        })
        .catch(err => {
            dispatch(alertError(err));
            dispatch(loginError());
        });
};

export const sendChat = () => dispatch => {

};

export const initializeChat = (group, gid) => ({
    type: 'INITIALIZE_CHAT',
    group,
    gid
});

export const gotNewChat = (message, chatId, gid) => ({
    type: 'GOT_NEW_CHAT',
    message,
    chatId,
    gid
});
