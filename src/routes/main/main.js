import React, {Component} from 'react';
import { connect } from 'react-redux';
import ChatContainer from '../../components/chatContainer.js';
import { Sidebar, Segment, Button, Menu, Image, Icon, Message } from 'semantic-ui-react';


class Main extends Component {
    state = {
        sidebarOn: false,
        chatRooms: {
            components: [],
            list: []
        }
    }

    toggleSidebar = () => {
        this.setState({
            sidebarOn: !this.state.sidebarOn
        });
    }

    toggleChatGroup = (inGroup) => {
        const idx = this.state.chatRooms.list.indexOf(inGroup.gid);
        // 리스트에 없으면 추가
        if (idx === -1) {
            this.setState({
                sidebarOn: false,
                chatRooms: {
                    components: [ ...this.state.chatRooms.components,
                        { inGroup, chats: this.props.groups[inGroup.gid].chats }
                    ],
                    list: [ ...this.state.chatRooms.list, inGroup.gid ]
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
                {chatRooms.components.map(({inGroup, chats}) => (
                    <ChatContainer firebase={this.props.firebase} closeChat={this.toggleChatGroup} key={inGroup.gid} inGroup={inGroup}/>
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

    // addGroup() {
    //     if(this.state.groupModal == 'open') {
    //         return ( <GroupAddModal /> );
    //     }
    // }

    render() {
        const {sidebarOn, chatRooms} = this.state;
        const {name, uid, inGroups} = this.props.user;
        return (
            <Sidebar.Pushable as={Segment}>
                <Sidebar as={Menu} animation='push' width='thin' visible={sidebarOn} icon='labeled' vertical inverted>
                    <Menu.Item name='home'>
                        <Icon name='home'/> {name}
                    </Menu.Item>
                    <Menu.Item name='add square'>
                        <label onClick={() => this.addGroup()}>
                            채팅 추가 {''}
                            <Icon name='add square'/>
                        </label>
                    </Menu.Item>
                    {inGroups.length > 0 ? inGroups.map((inGroup, idx) => (
                            <Menu.Item key={idx.toString()} name={inGroup.name} onClick={() => this.toggleChatGroup(inGroup)}>
                                <ul>
                                    <li>
                                        {inGroup.name}
                                    </li>
                                </ul>
                            </Menu.Item>
                        )) : (<li> no group </li>)
                    }
                </Sidebar>
                <Sidebar.Pusher>
                    <Segment basic>
                        <Button circular onClick={this.toggleSidebar} icon='setting'></Button>
                        { this.showChatRooms(chatRooms) }
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
