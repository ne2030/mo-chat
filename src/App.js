import React, {Component} from 'react';
// import GroupAddModal from './components/groupAddModal.js';
import { connect } from 'react-redux';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import firebase from 'firebase';

import Main from './routes/main/main.js';
import LoginModal from './routes/login/loginModal.js';

import './App.css';

const config = {
    apiKey: "AIzaSyDdW7V8bdfzQmCTUuBepBM2qgktYm-77bQ",
    authDomain: "mochat-3fd86.firebaseapp.com",
    databaseURL: "https://mochat-3fd86.firebaseio.com",
    projectId: "mochat-3fd86",
    storageBucket: "",
    messagingSenderId: "369231466921"
};

firebase.initializeApp(config);

class App extends Component {
    render() {
        return (
            <Router>
                <div className='App'>
                    <LoginModal firebase={firebase} />
                    {this.props.userStatus ? (<Main firebase={firebase} />) : ''}
                </div>
            </Router>
        );
    }
}

const mapStateToProps = (state) => {
    return {userStatus: state.login.status, groups: state.chat, error: state.error};
};

export default connect(mapStateToProps)(App);
