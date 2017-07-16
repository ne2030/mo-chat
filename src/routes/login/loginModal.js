import React, {Component} from 'react';
import { Modal, Button, Icon, Input, Segment, Form, Checkbox, Container, Grid} from 'semantic-ui-react';
import {login, signup} from '../../actions/actionCreator.js';
import {connect} from 'react-redux';
import './login.css';
import {enterSubmit} from '../../util.js';

class LoginModal extends Component {
    constructor() {
        super();
        this.enterSubmit = enterSubmit.bind(this);
    }
    state = {id: '', password: '', modalOpen: true, isSignup: false}

    handleChange = (e, data) => {
        this.setState({
            [data.placeholder]: data.value
        });
    }

    handleSubmit = () => {
        if(!this.state.isSignup) {
            this.props.dispatch(login(this.state));
        } else {
            this.props.dispatch(signup(this.state));
        }
    }

    statusChange = () => {
        this.setState({
            isSignup: !this.state.isSignup
        });
    }

    render() {
        const hideSignup = this.state.isSignup ? '' : 'hide';
        const hideSignin = this.state.isSignup ? 'hide' : '';
        return (
            <Modal size='small' open={!this.props.status} className="loginModal">
                <Modal.Header>
                    {hideSignup ? "Service Login" : "Service Sign Up" }
                    <Icon onClick={this.statusChange} className={`close ${hideSignup}`} name="remove"> </Icon>
                </Modal.Header>
                <Modal.Content>
                    <Input fluid={true} placeholder="id" className="loginInput" onKeyDown={this.enterSubmit} onChange={this.handleChange} iconPosition='left' icon='user'/>
                    <Input fluid={true} placeholder="password" className="loginInput" onKeyDown={this.enterSubmit} onChange={this.handleChange} type="password" iconPosition='left' icon='lock'/>
                    <Input fluid={true} placeholder="name" className={`loginInput ${hideSignup}`} onKeyDown={this.enterSubmit} onChange={this.handleChange} type="text" iconPosition='left' icon='address book'/>
                    <Button.Group className={hideSignin} attached='bottom'>
                        <Button color='teal' onClick={this.handleSubmit} loading={this.props.onRequest}>
                            <Icon name='checkmark'/>
                            로그인
                        </Button>
                        <Button color='blue' onClick={this.statusChange}>
                            회원가입
                        </Button>
                    </Button.Group>
                    <Button className={hideSignup} fluid={true} color="green" onClick={this.handleSubmit}>등록</Button>
                </Modal.Content>
            </Modal>
        )
    }
}

const mapStateToProps = (state) => {
    return state.login;
};

export default connect(mapStateToProps)(LoginModal);
