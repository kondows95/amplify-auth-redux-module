"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPasswordSubmit = exports.forgotPassword = exports.signIn = exports.signOut = exports.refreshToken = exports.fetchAuthedUser = exports.authForgotPasswordSuccess = exports.authSignInSuccess = exports.changeAuthState = exports.authError = exports.authBeginLoading = exports.authInit = exports.refreshTokenSuccess = exports.fetchAuthedUserSuccess = exports.initialState = void 0;
const aws_amplify_1 = require("aws-amplify");
exports.initialState = {
    authState: 'signIn',
    user: null,
    email: '',
    error: '',
    loading: false,
};
//=============================================================================
//Reducers
//=============================================================================
const _getCommonState = (state) => (Object.assign(Object.assign({}, state), { error: '', loading: false }));
exports.default = (state, action) => {
    switch (action.type) {
        case 'AUTH_FETCH_AUTHED_USER':
        case 'AUTH_REFRESH_TOKEN':
            return Object.assign(Object.assign({}, _getCommonState(state)), { user: action.payload });
        case 'AUTH_SYSTEM_ERROR':
            return Object.assign(Object.assign({}, _getCommonState(state)), { error: action.payload, loading: false });
        case 'AUTH_BEGIN_LOADING':
            return Object.assign(Object.assign({}, _getCommonState(state)), { loading: true });
        case 'AUTH_INIT':
            return Object.assign({}, exports.initialState);
        case 'AUTH_CHANGE_AUTH_STATE':
            return Object.assign(Object.assign({}, _getCommonState(state)), { authState: action.payload });
        case 'AUTH_SIGN_IN_SUCCESS':
            return Object.assign(Object.assign({}, _getCommonState(state)), { user: action.payload, authState: '' });
        case 'AUTH_FORGOT_PASSWORD_SUCCESS':
            return Object.assign(Object.assign({}, _getCommonState(state)), { authState: 'forgotPasswordReset', email: action.payload });
        default:
            return state;
    }
};
//=============================================================================
//Actions
//=============================================================================
exports.fetchAuthedUserSuccess = (user) => ({
    type: 'AUTH_FETCH_AUTHED_USER',
    payload: user,
});
exports.refreshTokenSuccess = (user) => ({
    type: 'AUTH_REFRESH_TOKEN',
    payload: user,
});
exports.authInit = () => ({
    type: 'AUTH_INIT',
});
exports.authBeginLoading = () => ({
    type: 'AUTH_BEGIN_LOADING',
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
exports.authError = (err) => ({
    type: 'AUTH_SYSTEM_ERROR',
    payload: err.message || err,
});
exports.changeAuthState = (value) => ({
    type: 'AUTH_CHANGE_AUTH_STATE',
    payload: value,
});
exports.authSignInSuccess = (user) => ({
    type: 'AUTH_SIGN_IN_SUCCESS',
    payload: user,
});
exports.authForgotPasswordSuccess = (email) => ({
    type: 'AUTH_FORGOT_PASSWORD_SUCCESS',
    payload: email,
});
exports.fetchAuthedUser = () => {
    return (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
        dispatch(exports.authBeginLoading());
        try {
            const user = yield aws_amplify_1.Auth.currentAuthenticatedUser();
            dispatch(exports.fetchAuthedUserSuccess(user));
        }
        catch (_a) {
            dispatch(exports.authInit());
        }
    });
};
exports.refreshToken = () => {
    return (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const cognitoUser = yield aws_amplify_1.Auth.currentAuthenticatedUser();
            const currentSession = yield aws_amplify_1.Auth.currentSession();
            cognitoUser.refreshSession(currentSession.getRefreshToken(), () => {
                dispatch(exports.refreshTokenSuccess(cognitoUser));
            });
        }
        catch (err) {
            dispatch(exports.authError(err));
        }
    });
};
exports.signOut = () => {
    return (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
        dispatch(exports.authInit());
        try {
            yield aws_amplify_1.Auth.signOut();
        }
        catch (err) {
            //No error message is set here.
            //If you set error message here, the message is always displayed.
            dispatch(exports.authError(err));
        }
    });
};
exports.signIn = (email, password) => {
    return (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
        dispatch(exports.authBeginLoading());
        try {
            const user = yield aws_amplify_1.Auth.signIn(email, password);
            dispatch(exports.authSignInSuccess(user));
        }
        catch (err) {
            dispatch(exports.authError(err));
        }
    });
};
exports.forgotPassword = (email) => {
    return (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
        dispatch(exports.authBeginLoading());
        try {
            yield aws_amplify_1.Auth.forgotPassword(email);
            dispatch(exports.authForgotPasswordSuccess(email));
        }
        catch (err) {
            dispatch(exports.authError(err));
        }
    });
};
exports.forgotPasswordSubmit = (email, code, password) => {
    return (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
        dispatch(exports.authBeginLoading());
        try {
            yield aws_amplify_1.Auth.forgotPasswordSubmit(email, code, password);
            dispatch(exports.authInit());
        }
        catch (err) {
            dispatch(exports.authError(err));
        }
    });
};
