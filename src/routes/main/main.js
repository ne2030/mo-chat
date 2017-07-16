import React, {Component} from 'react';
import { connect } from 'react-redux';
import ChatContainer from '../../components/chatContainer.js';
import AddGroupModal from '../../components/groupAddModal.js';
import InvitesModal from '../../components/invitesModal.js';
import { Sidebar, Segment, Button, Menu, Image, Icon, Message } from 'semantic-ui-react';
import './main.css';

class Main extends Component {
    state = {
        sidebarOn: false,
        chatRooms: {
            components: [],
            list: []
        },
        addGroup: false
    }

    toggleSidebar = () => {
        this.setState({
            sidebarOn: !this.state.sidebarOn
        });
    }

    toggleChatGroup = (inGroup, gid) => {
        const idx = this.state.chatRooms.list.indexOf(gid);
        // 리스트에 없으면 추가
        if (idx === -1) {
            if(!this.props.groups[gid]) {
                setTimeout(() => {this.toggleChatGroup(inGroup, gid);}, 100);
                return;
            }
            this.setState({
                sidebarOn: false,
                chatRooms: {
                    components: [ ...this.state.chatRooms.components,
                        { inGroup, gid, chats: this.props.groups[gid].chats }
                    ],
                    list: [ ...this.state.chatRooms.list, gid ]
                }
            });
        } else {
            const {components, list} = {
                components: [...this.state.chatRooms.components],
                list: [...this.state.chatRooms.list]
            };

            [components, list].forEach(arr => arr.splice(idx, 1));

            this.setState({
                sidebarOn: false,
                chatRooms: {
                    components: components,
                    list: list
                }
            })
        }
    }

    showChatRooms = chatRooms => {
        return chatRooms.list.length ?
            (<Segment.Group horizontal>
                {chatRooms.components.map(({inGroup, gid, chats}) => (
                    <ChatContainer closeChat={this.toggleChatGroup} key={gid} gid={gid} inGroup={inGroup}/>
                ))}
            </Segment.Group>) :
            (
                <Message icon>
                    <Icon name='circle notched' loading />
                    <Message.Content>
                        <Message.Header>Open Your Chat!</Message.Header>
                        Toggle setting-icon at the left top of this page.
                    </Message.Content>
                </Message>
            )
    }

    spreadGroupList = function(inGroups) {
        let list = [];
        for(let gid in inGroups) {
            let inGroup = inGroups[gid];
            list.push((
                <Menu.Item key={gid} name={inGroup.name} onClick={() => this.toggleChatGroup(inGroup, gid)}>
                        {inGroup.name}
                </Menu.Item>
            ));
        }
        return list;
    }

    render() {
        const {sidebarOn, chatRooms, addGroup} = this.state;
        const {name, uid, inGroups} = this.props.user;
        return (
            <Sidebar.Pushable as={Segment}>
                <Sidebar as={Menu} animation='scale down' width='thin' visible={sidebarOn} icon='labeled' vertical inverted>
                    <Menu.Item onClick={this.toggleSidebar} name='home'>
                        <Icon name='remove'/> 닫기
                    </Menu.Item>
                    <AddGroupModal />
                    {this.spreadGroupList(inGroups)}
                </Sidebar>
                <Sidebar.Pusher>
                    { this.props.user.recieveInvite && this.props.user.invites.length ? <InvitesModal/> : ''}
                    <Segment basic>
                        <Button className={sidebarOn ? 'hide' : ''} circular onClick={this.toggleSidebar} icon='setting'></Button>
                        {this.showChatRooms(chatRooms)}
                    </Segment>
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        )
    }
}

const mapStateToProps = (state) => {
    return {user: state.user, groups: state.chat, error: state.error};
};

export default connect(mapStateToProps)(Main);
