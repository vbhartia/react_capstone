import React from 'react';
import {connect} from 'react-redux';

import * as actions from '../actions/index';

export function WhatWeDoBox(props) {
    let showSignup = event => {
        event.preventDefault();
        props.dispatch(actions.showSignup());        
    };

    let showLogin = event => {
        event.preventDefault();
        props.dispatch(actions.showLogin());        
    };

    return (
        <div className="row whatWeDo">
            <div className="col-lg-12 col-sm-12">
                <div className="explainBox">
                    <p className="explain">Search for products, sign up to save your favorite items and share with your friends</p>
                    <button className="btn btn-default loginBtn" onClick={showLogin}>Log In</button>
                    <button className="btn btn-default signupBtn" onClick={showSignup}>Sign Up</button>
                </div>
            </div>
        </div>
    ); 
}

export default connect()(WhatWeDoBox);
