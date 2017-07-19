import React from 'react';
import {connect} from 'react-redux';

import * as actions from '../actions/index';
import Nav from './Nav';
import LandingPage from './landingPage';
import ShowSearchResults from './searchResults';
import WhatWeDo from './WhatWeDo';
import ShowImageList from './ShowImageList';
import LandingPageContainer from './landingPageContainer';
import UserLogin from './user';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';

export function App(props) {
    var loginModal;
    var signupModal;
    if(props.showLogin) {
        loginModal = <LoginModal />
    }
    if(props.showSignup) {
        signupModal = <SignupModal />
    }
    return (
        <div className="decorHome">
            <Nav/>
            {loginModal}
            {signupModal}
            <div>
                {props.children}
            </div>
        </div>
    );
}

const mapStateToProps = (state, props) => ({
    showSignup: state.showSignup,
    showLogin: state.showLogin,
    favorites: state.favorites,
});

export default connect(mapStateToProps)(App);