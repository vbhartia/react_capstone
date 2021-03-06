import React from 'react';
import {connect} from 'react-redux';

import * as actions from '../actions/index';
import Iframe from 'react-iframe';
import {Router, Route, IndexRoute, IndexRedirect, hashHistory, browserHistory} from 'react-router';
import ProductView from './ProductView';

class ProductPageView extends React.Component {
    constructor(props) {
        super(props);

        this.props.dispatch(actions.searchProductDetails(this.props.location.query.ASIN));
    }

    render () {
        if(this.props.productDetails) {
            var item = this.props.productDetails;

            if (item.ItemAttributes["0"].Feature) {
                var features = [];
                var featuresLen = item.ItemAttributes["0"].Feature.length;

                for (var i=0; i<featuresLen; i++) {
                    var featuresI = item.ItemAttributes["0"].Feature[i];
                    features.push(<li key={i}>{featuresI}</li>);
                }
            } 
            var extraDetails =  <div className="productFeature">
                                    <p>PRODUCT INFO</p>
                                    <ul>
                                        {features}
                                    </ul>
                                </div>;
            var reviews = item.CustomerReviews[0].IFrameURL[0];
            var customerReviews = <div className="row reviewsContainer">
                                    <Iframe url={reviews} 
                                        position="absolute"
                                        width="80%"
                                        height="120%"
                                        styles={{margin: "60px 0"}}
                                    />
                                 </div>


            return (
                <div className="productDetailsOuter">
                    <div className="productDetailsMiddle">
                        <div className="productDetailsInner">
                            <ProductView extraDetails={extraDetails} 
                                              customerReviews={customerReviews} />
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="errorMsgWrap">
                    <h1 className="errorSearch">{this.props.errorSearchMessage}</h1>
                </div>
            );
        }  
    }
}

const mapStateToProps = (state, props) => ({
    favorites: state.favorites,
    searchResults: state.searchResults,
    authenticated: localStorage.authHeaders,
    confirmAddFavoriteMessage: state.confirmAddFavoriteMessage,
    productDetails: state.productDetails,
    errorSearchMessage: state.errorSearchMessage,
});

export default connect(mapStateToProps)(ProductPageView);
