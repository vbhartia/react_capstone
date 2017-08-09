import React from 'react';
import {connect} from 'react-redux';

import * as actions from '../actions/index';
import SearchForm from './SearchForm';
import {Router, Route, IndexRoute, IndexRedirect, hashHistory, browserHistory} from 'react-router';

export function Logo(props) {
    let returnHome = event => {
        event.preventDefault();
        props.dispatch(actions.returnHome());
        hashHistory.push('/');
    }
    return (
        <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" id="homeIcon" href="/"><img src="css/images/home.png" width="21px"/></a>
            <a className="navbar-brand" href="#" onClick={returnHome}>HomeDecor</a>
        </div>
    );
}

export default connect()(Logo);