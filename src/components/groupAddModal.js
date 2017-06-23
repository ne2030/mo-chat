import React, {Component} from 'react';
import { Button, Icon, Modal, Input, Segment } from 'semantic-ui-react';
import {login} from '../actions/actionCreator.js';
import {connect} from 'react-redux';

class GroupAddModal extends Component {
    state = { form: {} }

    listingFriends = () => {
        let friendComponents = [];

        return friendComponents;
    }

    render () {
        return (
            <Modal trigger={< Button > Show Modal < /Button>}>
                <Modal.Header>Select a Photo</Modal.Header>
                <Modal.Content as="div">
                    <div className="friendsList">
                        {this.listingFriends()}
                    </div>
                    <Modal.Description>
                        <p>We've found the following gravatar image associated with your e-mail address.</p>
                        <p>Is it okay to use this photo?</p>
                    </Modal.Description>
                </Modal.Content>
            </Modal>
        )
    };

}

export default GroupAddModal;
