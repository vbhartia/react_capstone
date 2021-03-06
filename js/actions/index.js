import {Router, Route, IndexRoute, IndexRedirect, hashHistory, browserHistory} from 'react-router';

export const SEARCH_SUBMIT = 'SEARCH_SUBMIT';
export const makeSearchSubmitMsg = searchInput => ({
    type: SEARCH_SUBMIT,
    searchInput: searchInput
})

export const SHOW_SIGNUP = 'SHOW_SIGNUP';
export const showSignup = () => ({
    type: SHOW_SIGNUP
})

export const SHOW_LOGIN = 'SHOW_LOGIN';
export const showLogin = () => ({
    type: SHOW_LOGIN
})

export const HIDE = 'HIDE';
export const hide = () => ({
    type: HIDE
})

export const RETURN_HOME = 'RETURN_HOME';
export const returnHome = () => ({
    type: RETURN_HOME
})

export const SHOW_FAVORITES_ITEMS = 'SHOW_FAVORITES_ITEMS';
export const showFavoriteItems = (products) => ({
    type: SHOW_FAVORITES_ITEMS,
    products: products,
})

export const signupForm = (newUserData) => dispatch => {
    let url = '/signup';
    let fetchData = {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUserData),
    }
    return fetch(url, fetchData).then(response => {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    })
    .then(response => response.json())
    .then(data => {
        localStorage.authHeaders = "Basic " + btoa(newUserData.email + ":" + newUserData.password);
        localStorage.username = data.username;
        // hashHistory.push('/user');

        return dispatch(signupSuccess(data.username));
    })
    .catch(error => {
        return dispatch(signupError(error.message));
    })
}

export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS';
export const signupSuccess = (user) => ({
    type: SIGNUP_SUCCESS,
    user: user
})

export const SIGNUP_ERROR = 'SIGNUP_ERROR';
export const signupError = (error) => ({
    type: SIGNUP_ERROR,
    error: error
})

export const loginForm = (userData) => dispatch => {
    let url = '/login';
    let fetchData = {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': "Basic " + btoa(userData.email + ":" + userData.password),
            },
    }
    return fetch(url, fetchData).then(response => {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    })
    .then(response => response.json())
    .then(data => {
        localStorage.authHeaders = fetchData.headers.Authorization;
        localStorage.username = data.user.username;
        return dispatch(loginSuccess(data.user.username));
    })
    .catch(error => {
        return dispatch(loginError(error.message));
    })
}

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const loginSuccess = (user) => ({
    type: LOGIN_SUCCESS,
    user: user
})

export const LOGIN_ERROR = 'LOGIN_ERROR';
export const loginError = error => ({
    type: LOGIN_ERROR,
    error: error
})

export const logout = () => dispatch => {
    localStorage.removeItem('authHeaders');
    localStorage.removeItem('username');
    window.location = '/';
}

export const LOG_OUT_USER = 'LOG_OUT_USER';
export const logoutUser = () => ({
    type: LOG_OUT_USER
})

export const searchProductDetails = asin => dispatch => {
    dispatch(makeSearchSubmitMsg(asin));

    let url = `/amazon/product_details?ASIN=${asin}`;
    let fetchData = {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            },
    }
    return fetch(url, fetchData).then(response => {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    })
    .then(response => response.json())
    .then(data => {
        console.log('datadetails', data);
        return dispatch(showProductDetails(data[0]));
    })
    .catch(error => {
        console.error(error.stack);
        return dispatch(searchError(error.message));
    })
}

export const searchSubmit = (search_text, category, page) => dispatch => {
    dispatch(makeSearchSubmitMsg(search_text));

    let url = `/amazon/search?search_text=${search_text}&category=${category}&page=${page}`;
    let fetchData = {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            },
    }
    return fetch(url, fetchData).then(response => {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    })
    .then(response => response.json())
    .then(data => {
        console.log('data', data);
        return dispatch(makeSearchSuccessMsg(data, search_text, category, page));
    })
    .catch(error => {
        console.error(error.stack);
        return dispatch(searchError(error.message));
    })
}

export const SEARCH_SUCCESS = 'SEARCH_SUCCESS';
export const makeSearchSuccessMsg = (searchResults, searchInput, category, page) => ({
    type: SEARCH_SUCCESS,
    searchResults: searchResults,
    searchInput: searchInput,
    category: category,
    page: page
})

export const SEARCH_ERROR = 'SEARCH_ERROR';
export const searchError = error => ({
    type: SEARCH_ERROR,
    error: error,
})

export const SHOW_PRODUCT_DETAILS = 'SHOW_PRODUCT_DETAILS';
export const showProductDetails = (productDetails) => ({
    type: SHOW_PRODUCT_DETAILS,
    productDetails: productDetails,
})

export const SHOW_PRODUCT_QUICK_VIEW = 'SHOW_PRODUCT_QUICK_VIEW';
export const showProductQuickView = (productDetails) => ({
    type: SHOW_PRODUCT_QUICK_VIEW,
    productDetails: productDetails,
})

export const GO_TO_BEAUTY_SEARCH = 'GO_TO_BEAUTY_SEARCH';
export const gotoBeautySearch = () => ({
    type: GO_TO_BEAUTY_SEARCH,
})

export const GO_TO_ELECTRONICS_SEARCH = 'GO_TO_ELECTRONICS_SEARCH';
export const gotoElectronicsSearch = () => ({
    type: GO_TO_ELECTRONICS_SEARCH,
})

export const GO_TO_VITAMINS_SEARCH = 'GO_TO_VITAMINS_SEARCH';
export const gotoVitaminsSearch = () => ({
    type: GO_TO_VITAMINS_SEARCH,
})

export const GO_TO_BABY_SEARCH = 'GO_TO_BABY_SEARCH';
export const gotoBabySearch = () => ({
    type: GO_TO_BABY_SEARCH,
})

export const addFavorites = (product) => dispatch => {
    let url = '/favorites';
    let fetchData = {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': localStorage.authHeaders,
            },
            body: JSON.stringify(product),
    }
    return fetch(url, fetchData).then(response => {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    })
    .then(response => response.json())
    .then(data => {
        return dispatch(addFavoritesSuccess(data));
    })
    .catch(error => {
        return dispatch(addFavoritesError(error.message));
    })
}

export const ADD_FAVORITE_SUCCESS = 'ADD_FAVORITE_SUCCESS';
export const addFavoritesSuccess = products => ({
    type: ADD_FAVORITE_SUCCESS,
    products: products,
})

export const ADD_FAVORITE_ERROR = 'ADD_FAVORITE_ERROR';
export const addFavoritesError = error => ({
    type: ADD_FAVORITE_ERROR,
    error: error,
})

export const getFavorites = () => dispatch => {

    let url = '/favorites';
    let fetchData = {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': localStorage.authHeaders,
            },
    }
    return fetch(url, fetchData).then(response => {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    })
    .then(response => response.json())
    .then(data => {
        return dispatch(getFavoriteSuccess(data));
    })
    .catch(error => {
        return dispatch(getFavoriteError(error.message));
    })
}

export const GET_FAVORITES_SUCCESS = 'GET_FAVORITES_SUCCESS';
export const getFavoriteSuccess = products => ({
    type: GET_FAVORITES_SUCCESS,
    products: products,
})

export const GET_FAVORITES_ERROR = 'GET_FAVORITES_ERROR';
export const getFavoriteError = error => ({
    type: GET_FAVORITES_ERROR,
    error: error,
})

export const deleteFavorites = (product, callback) => dispatch => {
    swal({
        title: "Are you sure you want to delete the item?",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        closeOnConfirm: true,
        closeOnCancel: true
        },
        function(isConfirm) {
           if (isConfirm) {
                let url = '/favorites';
                let fetchData = {
                        method: 'DELETE',
                        headers: {
                            'Accept': 'application/json, text/plain, */*',
                            'Content-Type': 'application/json',
                            'Authorization': localStorage.authHeaders,
                        },
                        body: JSON.stringify(product),
                }
                return fetch(url, fetchData).then(response => {
                    if (!response.ok) {
                        throw Error(response.statusText);
                    }
                    return response;
                })
                .then(response => response.json())
                .then(data => {
                    dispatch(getFavorites());
                    return dispatch(deleteFavoriteSuccess(data));
                })
                .catch(error => {
                    return dispatch(deleteFavoriteError(error.message));
                })
            }
        }
    );
}

export const DELETE_FAVORITES_SUCCESS = 'DELETE_FAVORITES_SUCCESS';
export const deleteFavoriteSuccess = products => ({
    type: DELETE_FAVORITES_SUCCESS,
    products: products,
})

export const DELETE_FAVORITES_ERROR = 'DELETE_FAVORITES_ERROR';
export const deleteFavoriteError = error => ({
    type: DELETE_FAVORITES_ERROR,
    error: error,
})






















