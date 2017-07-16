import React, {Component} from 'react';
import { Button, Icon, Modal, Input, Segment, Dropdown, Menu } from 'semantic-ui-react';
import {alertError, createChatRoom, prepareChatCreation, endChatCreation} from '../actions/actionCreator.js';
import firebase from '../config.js';
import {connect} from 'react-redux';

class GroupAddModal extends Component {
    state = {userList: [], inviteList: [], name: ''}

    handleChange = (e, data) => {
        let key = data.type == 'text' ? 'name' : 'inviteList';
        this.setState({
            [key]: data.value
        });
    }

    toggleModal = () => {
        this.setState({
            modalOpen: !this.state.modalOpen
        });
    }

    prepareCreate = () => {
        this.props.dispatch(prepareChatCreation());
        this.getFriends();
    }

    getFriends = () => {
        let self = this;
        firebase.database().ref('users/list').once('value')
            .then(snapshot => {
                const data = snapshot.val();
                const userList = [];
                for(let uid in data) {
                    if(uid == self.props.user.uid) continue;
                    userList.push({
                        key: uid,
                        text: data[uid],
                        value: uid
                    });
                }
                self.setState({userList});
            })
            .catch(err => self.props.dispatch(alertError(err)));
    }

    createChatRoom = () => {
        this.props.dispatch(createChatRoom(this.state.inviteList, this.state.name));
        this.toggleModal();
    }

    render () {
        return (
            <Modal className="addGroupModal" size="small"
                open={this.state.modalOpen}
                onOpen={this.prepareCreate}
                onClose={this.exitModal}
                trigger={<Menu.Item onClick={this.toggleModal} name = 'add square'> 그룹 추가 </Menu.Item>}>
                <Modal.Header>대화상대 초대</Modal.Header>
                <Modal.Content>
                    <Input placeholder="채팅방 이름" fluid={true} onChange={this.handleChange} iconPosition='left' icon='users' value={this.state.name}/>
                    <Dropdown placeholder='이름 검색' fluid multiple selection options={this.state.userList} onChange={this.handleChange} value={this.state.inviteList}/>
                    <div className="btnGroup">

                    </div>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={this.toggleModal} color='red' inverted>
                        <Icon name='remove'/>
                        No
                    </Button>
                    <Button onClick={this.createChatRoom} color='green' inverted>
                        <Icon name='checkmark'/>
                        Yes
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    };
}

const mapStateToProps = (state) => ({user: state.user, groups: state.chat, error: state.error});
export default connect(mapStateToProps)(GroupAddModal);
