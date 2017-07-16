import React from 'react';
import {Icon, Segment} from 'semantic-ui-react'

const Chat = ({chat, chatId, isMine}) => (
    <div key={chatId} className="chat item">
        <div className={`${isMine ? 'rightChat' : 'leftChat'}`}>
        {isMine ? (
            <div>
                <div className="date">
                    {chat.timestamp}
                </div>
                <Segment className='chatContent'>
                    {chat.message}
                </Segment>
            </div>
        ) : (
            <div>
                <div className='chatUser'>
                    <Icon name='star'/>
                    {chat.user}
                </div>
                <div>
                    <Segment className='chatContent'>
                        {chat.message}
                    </Segment>
                    <div className="date">
                        {chat.timestamp}
                    </div>
                </div>
            </div>
        )}
        </div>
    </div>
)

export default Chat;
