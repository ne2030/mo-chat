import {Icon, Feed, Segment, List, Divider, Input, Button} from 'semantic-ui-react'
import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {sendChat, gotNewChat, initializeChat} from '../actions/actionCreator.js';

class ChatContainer extends Component {
    state = {content: '', lastIndex: 0}

    handleChange = (e, data) => {
        this.setState({
            content: data.value
        });
    }

    listingChat = gid => {
        let chats = this.props.groups[gid].chats;
        let chatComponents = [];

        for(let key in chats) {
            let chat = chats[key];
            chatComponents.push((<div key={key} className="chat item">
                <div className='chatUser'>
                    <Icon name='star'/> {chat.user}
                </div>
                <Segment className='chatContent'>
                    {chat.message}
                </Segment>
                <div className="date">
                    {chat.timestamp}
                </div>
            </div>));
        }
        return chatComponents;
    }

    handleSubmit = (e) => {
        if(e && e.keyCode == 13 && this.state.content !== '') {
            this.chatDB = this.props.firebase.database().ref(`chats/${this.props.inGroup.gid}`);
            let time = new Date();
            let timestamp = `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`;
            this.chatDB.push({
                uid: this.props.user.uid,
                user: this.props.user.name,
                timestamp,
                seq: this.props.inGroup.lastSeq + 1,
                message: this.state.content
            });
            this.setState({
                content: ''
            })
        }
    }

    // 스크롤 아래로 내리기
    componentDidMount = () => { this.refs.chatList.scrollTop = this.refs.chatList.scrollHeight; }
    componentDidUpdate = () => { this.refs.chatList.scrollTop = this.refs.chatList.scrollHeight; }

    render() {
        const {name, gid} = this.props.inGroup;
        return (
            <Segment className='chatContainer'>
                <div className="header">
                    <span>
                        {name}
                    </span>
                    <Button floated="right" size="mini" color="red" onClick={() => this.props.closeChat({name, gid})} inverted>
                        닫기
                    </Button>
                </div>
                <Divider fitted/>
                <div className='chatList' ref='chatList'>
                    <List relaxed>
                        { this.listingChat(gid)}
                    </List>
                </div>
                <Input icon='idea' iconPosition='left' placeholder="type here..." onKeyDown={this.handleSubmit} onChange={this.handleChange} value={this.state.content} />
            </Segment>
        )
    }
}

ChatContainer.PropTypes = {
    name: PropTypes.string,
    id: PropTypes.number
};

const mapStateToProps = (state) => ({user: state.user, groups: state.chat, error: state.error});
// export default ChatContainer;
export default connect(mapStateToProps)(ChatContainer);
