import React, {Component} from 'react';
// import GroupAddModal from './components/groupAddModal.js';
import { connect } from 'react-redux';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import Main from './routes/main/main.js';
import LoginModal from './routes/login/loginModal.js';

import './App.css';

class App extends Component {
    render() {
        return (
            <Router>
                <div className='App'>
                    <LoginModal />
                    {this.props.userStatus ? (<Main/>) : ''}
                </div>
            </Router>
        );
    }
}

const mapStateToProps = (state) => {
    return {userStatus: state.login.status, error: state.error};
};

export default connect(mapStateToProps)(App);
