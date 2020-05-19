import { Auth } from 'aws-amplify';
import { ThunkDispatch } from 'redux-thunk';
import { CognitoUser } from '@aws-amplify/auth';
//import AWS from 'aws-sdk';

export type Action = {
    type: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload?: any;
};

export type AuthState = {
    authState: string;
    error: string;
    loading: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user: any;
    email: string;
};

export const initialState: AuthState = {
    authState: 'signIn',
    user: null,
    email: '',
    error: '',
    loading: false,
};

//=============================================================================
//Reducers
//=============================================================================
const _getCommonState = (state: AuthState): AuthState => ({
    ...state,
    error: '',
    loading: false,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (state: AuthState, action: any): AuthState => {
    switch (action.type) {
        case 'AUTH_FETCH_AUTHED_USER':
        case 'AUTH_REFRESH_TOKEN':
            return {
                ..._getCommonState(state),
                user: action.payload,
            };
        case 'AUTH_SYSTEM_ERROR':
            return {
                ..._getCommonState(state),
                error: action.payload,
                loading: false,
            };
        case 'AUTH_BEGIN_LOADING':
            return {
                ..._getCommonState(state),
                loading: true,
            };
        case 'AUTH_INIT':
            return {
                ...initialState,
            };
        case 'AUTH_CHANGE_AUTH_STATE':
            return {
                ..._getCommonState(state),
                authState: action.payload,
            };
        case 'AUTH_SIGN_IN_SUCCESS':
            return {
                ..._getCommonState(state),
                user: action.payload,
                authState: '',
            };
        case 'AUTH_FORGOT_PASSWORD_SUCCESS':
            return {
                ..._getCommonState(state),
                authState: 'forgotPasswordReset',
                email: action.payload,
            };
        default:
            return state;
    }
};

//=============================================================================
//Actions
//=============================================================================
export const fetchAuthedUserSuccess = (user: CognitoUser): Action => ({
    type: 'AUTH_FETCH_AUTHED_USER',
    payload: user,
});

export const refreshTokenSuccess = (user: CognitoUser): Action => ({
    type: 'AUTH_REFRESH_TOKEN',
    payload: user,
});

export const authInit = (): Action => ({
    type: 'AUTH_INIT',
});

export const authBeginLoading = (): Action => ({
    type: 'AUTH_BEGIN_LOADING',
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const authError = (err: any): Action => ({
    type: 'AUTH_SYSTEM_ERROR',
    payload: err.message || err,
});

export const changeAuthState = (value: string): Action => ({
    type: 'AUTH_CHANGE_AUTH_STATE',
    payload: value,
});

export const authSignInSuccess = (user: CognitoUser): Action => ({
    type: 'AUTH_SIGN_IN_SUCCESS',
    payload: user,
});

export const authForgotPasswordSuccess = (email: string): Action => ({
    type: 'AUTH_FORGOT_PASSWORD_SUCCESS',
    payload: email,
});

//=============================================================================
//Async Operations
//=============================================================================
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Dispatch = ThunkDispatch<any, undefined, any>;

export const fetchAuthedUser = () => {
    return async (dispatch: Dispatch): Promise<void> => {
        dispatch(authBeginLoading());
        try {
            const user = await Auth.currentAuthenticatedUser();
            dispatch(fetchAuthedUserSuccess(user));
        } catch {
            dispatch(authInit());
        }
    };
};

export const refreshToken = () => {
    return async (dispatch: Dispatch): Promise<void> => {
        try {
            const cognitoUser = await Auth.currentAuthenticatedUser();
            const currentSession = await Auth.currentSession();
            cognitoUser.refreshSession(currentSession.getRefreshToken(), () => {
                dispatch(refreshTokenSuccess(cognitoUser));
            });
        } catch (err) {
            dispatch(authError(err));
        }
    };
};

export const signOut = () => {
    return async (dispatch: Dispatch): Promise<void> => {
        dispatch(authInit());
        try {
            await Auth.signOut();
        } catch (err) {
            //No error message is set here.
            //If you set error message here, the message is always displayed.
            dispatch(authError(err));
        }
    };
};

export const signIn = (email: string, password: string) => {
    return async (dispatch: Dispatch): Promise<void> => {
        dispatch(authBeginLoading());
        try {
            const user = await Auth.signIn(email, password);
            dispatch(authSignInSuccess(user));
        } catch (err) {
            dispatch(authError(err));
        }
    };
};

export const forgotPassword = (email: string) => {
    return async (dispatch: Dispatch): Promise<void> => {
        dispatch(authBeginLoading());
        try {
            await Auth.forgotPassword(email);
            dispatch(authForgotPasswordSuccess(email));
        } catch (err) {
            dispatch(authError(err));
        }
    };
};

export const forgotPasswordSubmit = (email: string, code: string, password: string) => {
    return async (dispatch: Dispatch): Promise<void> => {
        dispatch(authBeginLoading());
        try {
            await Auth.forgotPasswordSubmit(email, code, password);
            dispatch(authInit());
        } catch (err) {
            dispatch(authError(err));
        }
    };
};
