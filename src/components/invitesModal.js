import React, {Component} from 'react';
import { Modal, Checkbox, List, Button } from 'semantic-ui-react';
import {recieveInvite} from '../actions/actionCreator.js';
import firebase from '../config.js';
import {connect} from 'react-redux';

class InvitesModal extends Component {
    state = {modalClose: false, invites: {}}

    handleChange = (e, data) => {
        const [name, gid] = data.name.split(',');
        const prevValue = this.state.invites[gid];
        this.setState({
            invites: {
                ...this.state.invites,
                [gid]: {
                    value: !prevValue,
                    name: name
                }
            }
        });
    }

    handleSubmit = () => {
        this.props.dispatch(recieveInvite(this.state.invites));
        this.setState({
            modalClose: true
        });
    }

    listingInvite = () => {
        let invites = [];
        if(!this.props.user.recieveInvite) {
            setTimeout(this.listingInvite, 100);
            return;
        }
        this.props.user.invites.forEach(invite => {
            invites.push(
                (<List.Item key={invite.gid}>
                    <Checkbox key={invite.gid} name={`${invite.name},${invite.gid}`}
                        onChange={this.handleChange}
                        label={`${invite.name} from ${invite.user}`} />
                </List.Item>)
            )
        });
        return invites;
    }

    render () {
        return (
            <Modal open={!this.state.modalClose} className="invitesModal" size="small">
                <Modal.Header>초대받은 채팅방 목록</Modal.Header>
                <Modal.Content>
                    <List selection verticalAlign='middle'>
                        {this.listingInvite()}
                    </List>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={this.handleSubmit} color="green"> 완료 </Button>
                </Modal.Actions>
            </Modal>
        )
    };
}

const mapStateToProps = (state) => {
    return {user: state.user};
}

export default connect(mapStateToProps)(InvitesModal);
