import authReducer, {
    fetchAuthedUser,
    refreshToken,
    signOut,
    signIn,
    signUp,
    confirmSignUp,
    resendSignUp,
    forgotPasswordSubmit,
    forgotPassword,
    changeAuthState,
    AuthState,
    initialState as orginInitialState,
} from './index';
import { Auth } from 'aws-amplify';

let initialState: AuthState;
let dispatch: jest.Mock;
beforeEach(() => {
    dispatch = jest.fn();
    initialState = { ...orginInitialState };
});

//=============================================================================
//Reducers testing
//=============================================================================
it('AUTH_FETCH_AUTHED_USER', () => {
    const action = {
        type: 'AUTH_FETCH_AUTHED_USER',
        payload: {
            email: 'example@gmail.com',
            password: 'PW123',
            signInUserSession: {
                idToken: { jwtToken: '123456789' },
            },
        },
    };
    const expectedState = {
        ...initialState,
        user: {
            email: 'example@gmail.com',
            password: 'PW123',
            signInUserSession: {
                idToken: { jwtToken: '123456789' },
            },
        },
    };
    const inputState = authReducer(initialState, action);
    expect(inputState).toEqual(expectedState);
});

it('AUTH_REFRESH_TOKEN', () => {
    const action = {
        type: 'AUTH_REFRESH_TOKEN',
        payload: {
            email: 'example@gmail.com',
            password: 'PW123',
            signInUserSession: {
                idToken: { jwtToken: '123456789' },
            },
        },
    };
    const expectedState = {
        ...initialState,
        user: {
            email: 'example@gmail.com',
            password: 'PW123',
            signInUserSession: {
                idToken: { jwtToken: '123456789' },
            },
        },
    };
    const inputState = authReducer(initialState, action);
    expect(inputState).toEqual(expectedState);
});

it('AUTH_SYSTEM_ERROR', () => {
    const action = {
        type: 'AUTH_SYSTEM_ERROR',
        payload: 'system error',
    };
    const expectedState = {
        ...initialState,
        error: 'system error',
    };
    const inputState = authReducer(initialState, action);
    expect(inputState).toEqual(expectedState);
});

it('AUTH_BEGIN_LOADING', () => {
    const action = {
        type: 'AUTH_BEGIN_LOADING',
    };
    const expectedState = {
        ...initialState,
        loading: true,
    };
    const inputState = authReducer(initialState, action);
    expect(inputState).toEqual(expectedState);
});

it('AUTH_INIT', () => {
    const action = {
        type: 'AUTH_INIT',
    };
    const expectedState = {
        ...initialState,
    };
    const inputState = authReducer(initialState, action);
    expect(inputState).toEqual(expectedState);
});

it('AUTH_CHANGE_AUTH_STATE', () => {
    const action = {
        type: 'AUTH_CHANGE_AUTH_STATE',
        payload: 'signIn',
    };
    const expectedState = {
        ...initialState,
        authState: 'signIn',
    };
    const inputState = authReducer(initialState, action);
    expect(inputState).toEqual(expectedState);
});

it('AUTH_SIGN_IN_SUCCESS', () => {
    const action = {
        type: 'AUTH_SIGN_IN_SUCCESS',
        payload: {
            email: 'example@gmail.com',
            password: 'PW123',
            signInUserSession: {
                idToken: { jwtToken: '123456789' },
            },
        },
    };
    const expectedState = {
        ...initialState,
        user: {
            email: 'example@gmail.com',
            password: 'PW123',
            signInUserSession: {
                idToken: { jwtToken: '123456789' },
            },
        },
        authState: '',
    };
    const inputState = authReducer(initialState, action);
    expect(inputState).toEqual(expectedState);
});

it('AUTH_SIGN_UP_SUCCESS', () => {
    const action = {
        type: 'AUTH_SIGN_UP_SUCCESS',
        payload: 'example@gmail.com',
    };
    const expectedState = {
        ...initialState,
        email: 'example@gmail.com',
        authState: 'confirmSignUp',
    };
    const inputState = authReducer(initialState, action);
    expect(inputState).toEqual(expectedState);
});

it('AUTH_FORGOT_PASSWORD_SUCCESS', () => {
    const action = {
        type: 'AUTH_FORGOT_PASSWORD_SUCCESS',
        payload: 'example@gmail.com',
    };
    const expectedState = {
        ...initialState,
        authState: 'forgotPasswordReset',
        email: 'example@gmail.com',
    };
    const inputState = authReducer(initialState, action);
    expect(inputState).toEqual(expectedState);
});

it('Default reducer', () => {
    const action = {
        type: 'Default',
    };

    const expectedState = {
        ...initialState,
    };

    expect(authReducer(initialState, action)).toEqual(expectedState);
    expect(authReducer(undefined, action)).toEqual(expectedState);
});

//=============================================================================
//Operations testing
//=============================================================================
const expectedActionBeginLoading = [
    {
        type: 'AUTH_BEGIN_LOADING',
    },
];

const expectedActionInit = [
    {
        type: 'AUTH_INIT',
    },
];

it('changeAuthState', async () => {
    const expectedAction = {
        type: 'AUTH_CHANGE_AUTH_STATE',
        payload: 'signIn',
    };
    const value = 'signIn';
    const action = changeAuthState(value);
    expect(action).toEqual(expectedAction);
});

it('fetchAuthedUser success', async () => {
    const user = { data: { email: 'test@example.com' } };
    Auth.currentAuthenticatedUser = jest.fn().mockImplementation(() => {
        return user;
    });

    const expectedAction = [
        {
            type: 'AUTH_FETCH_AUTHED_USER',
            payload: { data: { email: 'test@example.com' } },
        },
    ];

    await fetchAuthedUser()(dispatch);
    expect(Auth.currentAuthenticatedUser).toHaveBeenCalled();
    expect(dispatch.mock.calls[0]).toEqual(expectedActionBeginLoading);
    expect(dispatch.mock.calls[1]).toEqual(expectedAction);
});

it('fetchAuthedUser error', async () => {
    Auth.currentAuthenticatedUser = jest.fn().mockImplementation(() => {
        throw 'system error';
    });

    await fetchAuthedUser()(dispatch);
    expect(Auth.currentAuthenticatedUser).toHaveBeenCalledWith();
    expect(dispatch.mock.calls[0]).toEqual(expectedActionBeginLoading);
    expect(dispatch.mock.calls[1]).toEqual(expectedActionInit);
});

it('refreshToken success', async () => {
    const cognitoUser = {
        refreshSession: jest.fn((token: string, callback: () => void) => {
            callback();
        }),
    };
    Auth.currentAuthenticatedUser = jest.fn().mockImplementation(async () => {
        return cognitoUser;
    });
    Auth.currentSession = jest.fn().mockImplementation(async () => {
        return { getRefreshToken: jest.fn() };
    });
    await refreshToken()(dispatch);
    expect(cognitoUser.refreshSession).toHaveBeenCalled();
});

it('refreshToken error', async () => {
    Auth.currentAuthenticatedUser = jest.fn().mockImplementation(async () => {
        throw 'system error';
    });

    const expectedAction = [
        {
            type: 'AUTH_SYSTEM_ERROR',
            payload: 'system error',
        },
    ];

    await refreshToken()(dispatch);
    expect(dispatch.mock.calls[0]).toEqual(expectedAction);
});

it('signOut success', async () => {
    Auth.signOut = jest.fn();
    await signOut()(dispatch);
    expect(Auth.signOut).toHaveBeenCalled();
    expect(dispatch.mock.calls[0]).toEqual(expectedActionInit);
});

it('signOut error', async () => {
    Auth.signOut = jest.fn().mockImplementation(() => {
        throw 'system error';
    });

    const expectedAction = [
        {
            type: 'AUTH_SYSTEM_ERROR',
            payload: 'system error',
        },
    ];

    await signOut()(dispatch);
    expect(Auth.signOut).toHaveBeenCalledWith();
    expect(dispatch.mock.calls[0]).toEqual(expectedActionInit);
    expect(dispatch.mock.calls[1]).toEqual(expectedAction);
});

it('signIn success', async () => {
    Auth.signIn = jest.fn().mockImplementation(() => {
        return { data: { email: 'test@example.com', password: 'PW123' } };
    });

    const expectedAction = [
        {
            type: 'AUTH_SIGN_IN_SUCCESS',
            payload: { data: { email: 'test@example.com', password: 'PW123' } },
        },
    ];

    await signIn('test@example.com', 'PW123')(dispatch);
    expect(Auth.signIn).toHaveBeenCalledWith('test@example.com', 'PW123');
    expect(dispatch.mock.calls[0]).toEqual(expectedActionBeginLoading);
    expect(dispatch.mock.calls[1]).toEqual(expectedAction);
});

it('signIn error', async () => {
    Auth.signIn = jest.fn().mockImplementation(() => {
        throw 'system error';
    });

    const expectedAction = [
        {
            type: 'AUTH_SYSTEM_ERROR',
            payload: 'system error',
        },
    ];

    await signIn('test@example.com', 'PW123')(dispatch);
    expect(Auth.signIn).toHaveBeenCalledWith('test@example.com', 'PW123');
    expect(dispatch.mock.calls[0]).toEqual(expectedActionBeginLoading);
    expect(dispatch.mock.calls[1]).toEqual(expectedAction);
});

it('signUp success', async () => {
    Auth.signUp = jest.fn();

    const expectedAction = [
        {
            type: 'AUTH_SIGN_UP_SUCCESS',
            payload: 'test@example.com',
        },
    ];

    await signUp('test@example.com', 'PW123')(dispatch);
    expect(Auth.signUp).toHaveBeenCalledWith('test@example.com', 'PW123');
    expect(dispatch.mock.calls[0]).toEqual(expectedActionBeginLoading);
    expect(dispatch.mock.calls[1]).toEqual(expectedAction);
});

it('signUp error', async () => {
    Auth.signUp = jest.fn().mockImplementation(() => {
        throw 'system error';
    });

    const expectedAction = [
        {
            type: 'AUTH_SYSTEM_ERROR',
            payload: 'system error',
        },
    ];

    await signUp('test@example.com', 'PW123')(dispatch);
    expect(Auth.signUp).toHaveBeenCalledWith('test@example.com', 'PW123');
    expect(dispatch.mock.calls[0]).toEqual(expectedActionBeginLoading);
    expect(dispatch.mock.calls[1]).toEqual(expectedAction);
});

it('confirmSignUp success', async () => {
    Auth.confirmSignUp = jest.fn();
    await confirmSignUp('test@example.com', 'CD123')(dispatch);
    expect(Auth.confirmSignUp).toHaveBeenCalledWith('test@example.com', 'CD123');
    expect(dispatch.mock.calls[0]).toEqual(expectedActionBeginLoading);
    expect(dispatch.mock.calls[1]).toEqual(expectedActionInit);
});

it('confirmSignUp error', async () => {
    Auth.confirmSignUp = jest.fn().mockImplementation(() => {
        throw 'system error';
    });

    const expectedAction = [
        {
            type: 'AUTH_SYSTEM_ERROR',
            payload: 'system error',
        },
    ];

    await confirmSignUp('test@example.com', 'PW123')(dispatch);
    expect(Auth.confirmSignUp).toHaveBeenCalledWith('test@example.com', 'PW123');
    expect(dispatch.mock.calls[0]).toEqual(expectedActionBeginLoading);
    expect(dispatch.mock.calls[1]).toEqual(expectedAction);
});

it('resendSignUp success', async () => {
    Auth.resendSignUp = jest.fn();
    await resendSignUp('test@example.com')(dispatch);
    expect(Auth.resendSignUp).toHaveBeenCalledWith('test@example.com');
    expect(dispatch.mock.calls[0]).toEqual(expectedActionBeginLoading);
    expect(dispatch.mock.calls[1]).toEqual(expectedActionInit);
});

it('resendSignUp error', async () => {
    Auth.resendSignUp = jest.fn().mockImplementation(() => {
        throw 'system error';
    });

    const expectedAction = [
        {
            type: 'AUTH_SYSTEM_ERROR',
            payload: 'system error',
        },
    ];

    await resendSignUp('test@example.com')(dispatch);
    expect(Auth.resendSignUp).toHaveBeenCalledWith('test@example.com');
    expect(dispatch.mock.calls[0]).toEqual(expectedActionBeginLoading);
    expect(dispatch.mock.calls[1]).toEqual(expectedAction);
});

it('forgotPasswordSubmit success', async () => {
    Auth.forgotPasswordSubmit = jest.fn();
    await forgotPasswordSubmit('test@example.com', 'CD123', 'PW123')(dispatch);
    expect(Auth.forgotPasswordSubmit).toHaveBeenCalledWith('test@example.com', 'CD123', 'PW123');
    expect(dispatch.mock.calls[0]).toEqual(expectedActionBeginLoading);
    expect(dispatch.mock.calls[1]).toEqual(expectedActionInit);
});

it('forgotPasswordSubmit error', async () => {
    Auth.forgotPasswordSubmit = jest.fn().mockImplementation(() => {
        throw 'system error';
    });

    const expectedAction = [
        {
            type: 'AUTH_SYSTEM_ERROR',
            payload: 'system error',
        },
    ];

    await forgotPasswordSubmit('test@example.com', 'CD123', 'PW123')(dispatch);
    expect(Auth.forgotPasswordSubmit).toHaveBeenCalledWith('test@example.com', 'CD123', 'PW123');
    expect(dispatch.mock.calls[0]).toEqual(expectedActionBeginLoading);
    expect(dispatch.mock.calls[1]).toEqual(expectedAction);
});

it('forgotPassword success', async () => {
    Auth.forgotPassword = jest.fn();

    const expectedAction = [
        {
            type: 'AUTH_FORGOT_PASSWORD_SUCCESS',
            payload: 'test@example.com',
        },
    ];

    await forgotPassword('test@example.com')(dispatch);
    expect(Auth.forgotPassword).toHaveBeenCalledWith('test@example.com');
    expect(dispatch.mock.calls[0]).toEqual(expectedActionBeginLoading);
    expect(dispatch.mock.calls[1]).toEqual(expectedAction);
});

it('forgotPassword error', async () => {
    Auth.forgotPassword = jest.fn().mockImplementation(() => {
        throw 'system error';
    });

    const expectedAction = [
        {
            type: 'AUTH_SYSTEM_ERROR',
            payload: 'system error',
        },
    ];

    await forgotPassword('test@example.com')(dispatch);
    expect(Auth.forgotPassword).toHaveBeenCalledWith('test@example.com');
    expect(dispatch.mock.calls[0]).toEqual(expectedActionBeginLoading);
    expect(dispatch.mock.calls[1]).toEqual(expectedAction);
});
