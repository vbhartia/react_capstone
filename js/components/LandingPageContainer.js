import React from 'react';
import {connect} from 'react-redux';

import * as actions from '../actions/index';
import LandingPage from './LandingPage';
import WhatWeDo from './WhatWeDo';
import CategoryViews from './CategoryViews';
import UserLogin from './User';
import SearchForm from './SearchForm';
import Footer from './Footer';

function LandingPageContainer(props) {
    return (
        <div className="indexPage">
            <div className="indexPageWrap">
                <LandingPage />
            </div>
            <Footer/>
        </div>
    );
}

const mapStateToProps = (state, props) => ({
    landingPageHidden: state.landingPageHidden,
    searchResults: state.searchResults,
    authenticated: localStorage.authHeaders,
    errorSearchMessage: state.errorSearchMessage,
});

export default connect(mapStateToProps)(LandingPageContainer);




