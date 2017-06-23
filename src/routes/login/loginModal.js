import React, {Component} from 'react';
import { Modal, Button, Icon, Input, Segment, Form, Checkbox, Container, Grid} from 'semantic-ui-react';
import {login} from '../../actions/actionCreator.js';
import {connect} from 'react-redux';

class LoginModal extends Component {
    state = {id: '', password: '', modalOpen: true}

    handleChange = (e, data) => {
        let state = {...this.state};
        state[data.placeholder] = data.value;
        this.setState(state);
    }

    handleSubmit = () => {
        this.props.dispatch(login({...this.state, firebase: this.props.firebase}));
    }

    enterSubmit = (e) => {
        if(e && e.keyCode === 13) {
            this.handleSubmit();
        }
    }

    render() {
        return (
            <Modal size='small' open={!this.props.status} className="loginModal">
                <Modal.Header>Service Login</Modal.Header>
                <Modal.Content>
                    <Input fluid={true} placeholder="E-mail address" className="loginInput" onKeyDown={this.enterSubmit} onChange={this.handleChange} iconPosition='left' icon='user'/>
                    <Input fluid={true} placeholder="Password" className="loginInput" onKeyDown={this.enterSubmit} onChange={this.handleChange} type="password" iconPosition='left' icon='lock'/>
                    <Button fluid={true} color='teal' onClick={this.handleSubmit} loading={this.props.onRequest}>
                        <Icon name='checkmark'/>
                        로그인
                    </Button>
                </Modal.Content>
            </Modal>
        )
    }
}

const mapStateToProps = (state) => {
    return state.login;
};

export default connect(mapStateToProps)(LoginModal);
