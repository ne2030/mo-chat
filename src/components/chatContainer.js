import {Icon, Segment, List, Divider, Input, Button} from 'semantic-ui-react'
import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {sendChat, gotNewChat} from '../actions/actionCreator.js';
import Chat from './chat.js';
import firebase from '../config.js';
import {enterSubmit} from '../util.js';

class ChatContainer extends Component {
    constructor() {
        super();
        this.enterSubmit = enterSubmit.bind(this);
    }

    state = {content: '', lastIndex: 0}

    handleChange = (e, data) => {
        this.setState({
            content: data.value
        });
    }

    listingChat = gid => {
        let chats = this.props.groups[gid].chats;
        let chatComponents = [];

        for(let chatId in chats) {
            let chat = chats[chatId];
            let isMine = chat.user === this.props.user.name;
            chatComponents.push(<Chat chat={chat} key={chatId} chatId={chatId} isMine={isMine}/>)
        }
        return chatComponents;
    }

    handleSubmit = () => {
        if(typeof this.props.inGroup.lastSeq !== 'number') {
            setTimeout(this.handleSubmit, 100);
            return;
        }

        if(this.state.content !== '') {
            this.chatDB = firebase.database().ref(`chats/${this.props.gid}`);
            let time = new Date();
            let timestamp = `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`;
            console.log(this.props.inGroup.lastSeq);
            let newChat = {
                uid: this.props.user.uid,
                user: this.props.user.name,
                timestamp,
                seq: this.props.inGroup.lastSeq + 1,
                message: this.state.content
            };
            this.chatDB.push(newChat);
            this.setState({
                content: ''
            })
        }
    }

    // 스크롤 아래로 내리기
    componentDidMount = () => { this.refs.chatList.scrollTop = this.refs.chatList.scrollHeight; }
    componentDidUpdate = () => { this.refs.chatList.scrollTop = this.refs.chatList.scrollHeight; }

    render() {
        const [name, gid] = [this.props.inGroup.name, this.props.gid];
        return (
            <Segment className='chatContainer'>
                <div className="header">
                    <span>
                        {name}
                    </span>
                    <Button floated="right" size="mini" color="red" inverted
                        onClick={() => this.props.closeChat(name, gid)}>
                        닫기
                    </Button>
                </div>
                <Divider fitted/>
                <div className='chatList' ref='chatList'>
                    <List relaxed>
                        { this.listingChat(gid)}
                    </List>
                </div>
                <Input icon='idea' iconPosition='left' placeholder="type here..."
                    label={<Button onClick={this.handleSubmit} color="teal"> 전송 </Button>}
                    labelPosition="right"
                    onKeyDown={this.enterSubmit}
                    onChange={this.handleChange}
                    value={this.state.content} />
            </Segment>
        )
    }
}

ChatContainer.PropTypes = {
    name: PropTypes.string,
    id: PropTypes.number
};

const mapStateToProps = (state) => ({user: state.user, groups: state.chat, error: state.error});
export default connect(mapStateToProps)(ChatContainer);
