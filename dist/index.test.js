"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const index_1 = __importStar(require("./index"));
const aws_amplify_1 = require("aws-amplify");
let initialState;
let dispatch;
beforeEach(() => {
    dispatch = jest.fn();
    initialState = Object.assign({}, index_1.initialState);
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
    const expectedState = Object.assign(Object.assign({}, initialState), { user: {
            email: 'example@gmail.com',
            password: 'PW123',
            signInUserSession: {
                idToken: { jwtToken: '123456789' },
            },
        } });
    const inputState = index_1.default(initialState, action);
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
    const expectedState = Object.assign(Object.assign({}, initialState), { user: {
            email: 'example@gmail.com',
            password: 'PW123',
            signInUserSession: {
                idToken: { jwtToken: '123456789' },
            },
        } });
    const inputState = index_1.default(initialState, action);
    expect(inputState).toEqual(expectedState);
});
it('AUTH_SYSTEM_ERROR', () => {
    const action = {
        type: 'AUTH_SYSTEM_ERROR',
        payload: 'system error',
    };
    const expectedState = Object.assign(Object.assign({}, initialState), { error: 'system error' });
    const inputState = index_1.default(initialState, action);
    expect(inputState).toEqual(expectedState);
});
it('AUTH_BEGIN_LOADING', () => {
    const action = {
        type: 'AUTH_BEGIN_LOADING',
    };
    const expectedState = Object.assign(Object.assign({}, initialState), { loading: true });
    const inputState = index_1.default(initialState, action);
    expect(inputState).toEqual(expectedState);
});
it('AUTH_END_LOADING', () => {
    const action = {
        type: 'AUTH_END_LOADING',
    };
    const inputState = index_1.default(initialState, action);
    expect(inputState).toEqual(initialState);
});
it('AUTH_INIT', () => {
    const action = {
        type: 'AUTH_INIT',
    };
    const expectedState = Object.assign({}, initialState);
    const inputState = index_1.default(initialState, action);
    expect(inputState).toEqual(expectedState);
});
it('AUTH_CHANGE_AUTH_STATE', () => {
    const action = {
        type: 'AUTH_CHANGE_AUTH_STATE',
        payload: 'signIn',
    };
    const expectedState = Object.assign(Object.assign({}, initialState), { authState: 'signIn' });
    const inputState = index_1.default(initialState, action);
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
    const expectedState = Object.assign(Object.assign({}, initialState), { user: {
            email: 'example@gmail.com',
            password: 'PW123',
            signInUserSession: {
                idToken: { jwtToken: '123456789' },
            },
        }, authState: '' });
    const inputState = index_1.default(initialState, action);
    expect(inputState).toEqual(expectedState);
});
it('AUTH_SIGN_UP_SUCCESS', () => {
    const action = {
        type: 'AUTH_SIGN_UP_SUCCESS',
        payload: 'example@gmail.com',
    };
    const expectedState = Object.assign(Object.assign({}, initialState), { email: 'example@gmail.com', authState: 'confirmSignUp' });
    const inputState = index_1.default(initialState, action);
    expect(inputState).toEqual(expectedState);
});
it('AUTH_FORGOT_PASSWORD_SUCCESS', () => {
    const action = {
        type: 'AUTH_FORGOT_PASSWORD_SUCCESS',
        payload: 'example@gmail.com',
    };
    const expectedState = Object.assign(Object.assign({}, initialState), { authState: 'forgotPasswordReset', email: 'example@gmail.com' });
    const inputState = index_1.default(initialState, action);
    expect(inputState).toEqual(expectedState);
});
it('Default reducer', () => {
    const action = {
        type: 'Default',
    };
    const expectedState = Object.assign({}, initialState);
    expect(index_1.default(initialState, action)).toEqual(expectedState);
    expect(index_1.default(undefined, action)).toEqual(expectedState);
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
it('changeAuthState', () => __awaiter(void 0, void 0, void 0, function* () {
    const expectedAction = {
        type: 'AUTH_CHANGE_AUTH_STATE',
        payload: 'signIn',
    };
    const value = 'signIn';
    const action = index_1.changeAuthState(value);
    expect(action).toEqual(expectedAction);
}));
it('fetchAuthedUser success', () => __awaiter(void 0, void 0, void 0, function* () {
    const user = { data: { email: 'test@example.com' } };
    aws_amplify_1.Auth.currentAuthenticatedUser = jest.fn().mockImplementation(() => {
        return user;
    });
    const expectedAction = [
        {
            type: 'AUTH_FETCH_AUTHED_USER',
            payload: { data: { email: 'test@example.com' } },
        },
    ];
    yield index_1.fetchAuthedUser()(dispatch);
    expect(aws_amplify_1.Auth.currentAuthenticatedUser).toHaveBeenCalled();
    expect(dispatch.mock.calls[0]).toEqual(expectedActionBeginLoading);
    expect(dispatch.mock.calls[1]).toEqual(expectedAction);
}));
it('fetchAuthedUser error', () => __awaiter(void 0, void 0, void 0, function* () {
    aws_amplify_1.Auth.currentAuthenticatedUser = jest.fn().mockImplementation(() => {
        throw 'system error';
    });
    yield index_1.fetchAuthedUser()(dispatch);
    expect(aws_amplify_1.Auth.currentAuthenticatedUser).toHaveBeenCalledWith();
    expect(dispatch.mock.calls[0]).toEqual(expectedActionBeginLoading);
    expect(dispatch.mock.calls[1]).toEqual(expectedActionInit);
}));
it('refreshToken success', () => __awaiter(void 0, void 0, void 0, function* () {
    const cognitoUser = {
        refreshSession: jest.fn((token, callback) => {
            callback();
        }),
    };
    aws_amplify_1.Auth.currentAuthenticatedUser = jest.fn().mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () {
        return cognitoUser;
    }));
    aws_amplify_1.Auth.currentSession = jest.fn().mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () {
        return { getRefreshToken: jest.fn() };
    }));
    yield index_1.refreshToken()(dispatch);
    expect(cognitoUser.refreshSession).toHaveBeenCalled();
}));
it('refreshToken error', () => __awaiter(void 0, void 0, void 0, function* () {
    aws_amplify_1.Auth.currentAuthenticatedUser = jest.fn().mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () {
        throw 'system error';
    }));
    const expectedAction = [
        {
            type: 'AUTH_SYSTEM_ERROR',
            payload: 'system error',
        },
    ];
    yield index_1.refreshToken()(dispatch);
    expect(dispatch.mock.calls[0]).toEqual(expectedAction);
}));
it('signOut success', () => __awaiter(void 0, void 0, void 0, function* () {
    aws_amplify_1.Auth.signOut = jest.fn();
    yield index_1.signOut()(dispatch);
    expect(aws_amplify_1.Auth.signOut).toHaveBeenCalled();
    expect(dispatch.mock.calls[0]).toEqual(expectedActionInit);
}));
it('signOut error', () => __awaiter(void 0, void 0, void 0, function* () {
    aws_amplify_1.Auth.signOut = jest.fn().mockImplementation(() => {
        throw 'system error';
    });
    const expectedAction = [
        {
            type: 'AUTH_SYSTEM_ERROR',
            payload: 'system error',
        },
    ];
    yield index_1.signOut()(dispatch);
    expect(aws_amplify_1.Auth.signOut).toHaveBeenCalledWith();
    expect(dispatch.mock.calls[0]).toEqual(expectedActionInit);
    expect(dispatch.mock.calls[1]).toEqual(expectedAction);
}));
it('signIn success', () => __awaiter(void 0, void 0, void 0, function* () {
    aws_amplify_1.Auth.signIn = jest.fn().mockImplementation(() => {
        return { data: { email: 'test@example.com', password: 'PW123' } };
    });
    const expectedAction = [
        {
            type: 'AUTH_SIGN_IN_SUCCESS',
            payload: { data: { email: 'test@example.com', password: 'PW123' } },
        },
    ];
    yield index_1.signIn('test@example.com', 'PW123')(dispatch);
    expect(aws_amplify_1.Auth.signIn).toHaveBeenCalledWith('test@example.com', 'PW123');
    expect(dispatch.mock.calls[0]).toEqual(expectedActionBeginLoading);
    expect(dispatch.mock.calls[1]).toEqual(expectedAction);
}));
it('signIn error', () => __awaiter(void 0, void 0, void 0, function* () {
    aws_amplify_1.Auth.signIn = jest.fn().mockImplementation(() => {
        throw 'system error';
    });
    const expectedAction = [
        {
            type: 'AUTH_SYSTEM_ERROR',
            payload: 'system error',
        },
    ];
    yield index_1.signIn('test@example.com', 'PW123')(dispatch);
    expect(aws_amplify_1.Auth.signIn).toHaveBeenCalledWith('test@example.com', 'PW123');
    expect(dispatch.mock.calls[0]).toEqual(expectedActionBeginLoading);
    expect(dispatch.mock.calls[1]).toEqual(expectedAction);
}));
it('signUp success', () => __awaiter(void 0, void 0, void 0, function* () {
    aws_amplify_1.Auth.signUp = jest.fn();
    const expectedAction = [
        {
            type: 'AUTH_SIGN_UP_SUCCESS',
            payload: 'test@example.com',
        },
    ];
    yield index_1.signUp('test@example.com', 'PW123')(dispatch);
    expect(aws_amplify_1.Auth.signUp).toHaveBeenCalledWith('test@example.com', 'PW123');
    expect(dispatch.mock.calls[0]).toEqual(expectedActionBeginLoading);
    expect(dispatch.mock.calls[1]).toEqual(expectedAction);
}));
it('signUp error', () => __awaiter(void 0, void 0, void 0, function* () {
    aws_amplify_1.Auth.signUp = jest.fn().mockImplementation(() => {
        throw 'system error';
    });
    const expectedAction = [
        {
            type: 'AUTH_SYSTEM_ERROR',
            payload: 'system error',
        },
    ];
    yield index_1.signUp('test@example.com', 'PW123')(dispatch);
    expect(aws_amplify_1.Auth.signUp).toHaveBeenCalledWith('test@example.com', 'PW123');
    expect(dispatch.mock.calls[0]).toEqual(expectedActionBeginLoading);
    expect(dispatch.mock.calls[1]).toEqual(expectedAction);
}));
it('confirmSignUp success', () => __awaiter(void 0, void 0, void 0, function* () {
    aws_amplify_1.Auth.confirmSignUp = jest.fn();
    yield index_1.confirmSignUp('test@example.com', 'CD123')(dispatch);
    expect(aws_amplify_1.Auth.confirmSignUp).toHaveBeenCalledWith('test@example.com', 'CD123');
    expect(dispatch.mock.calls[0]).toEqual(expectedActionBeginLoading);
    expect(dispatch.mock.calls[1]).toEqual(expectedActionInit);
}));
it('confirmSignUp error', () => __awaiter(void 0, void 0, void 0, function* () {
    aws_amplify_1.Auth.confirmSignUp = jest.fn().mockImplementation(() => {
        throw 'system error';
    });
    const expectedAction = [
        {
            type: 'AUTH_SYSTEM_ERROR',
            payload: 'system error',
        },
    ];
    yield index_1.confirmSignUp('test@example.com', 'PW123')(dispatch);
    expect(aws_amplify_1.Auth.confirmSignUp).toHaveBeenCalledWith('test@example.com', 'PW123');
    expect(dispatch.mock.calls[0]).toEqual(expectedActionBeginLoading);
    expect(dispatch.mock.calls[1]).toEqual(expectedAction);
}));
it('resendSignUp success', () => __awaiter(void 0, void 0, void 0, function* () {
    aws_amplify_1.Auth.resendSignUp = jest.fn();
    const expectedAction = [
        {
            type: 'AUTH_END_LOADING',
        },
    ];
    yield index_1.resendSignUp('test@example.com')(dispatch);
    expect(aws_amplify_1.Auth.resendSignUp).toHaveBeenCalledWith('test@example.com');
    expect(dispatch.mock.calls[0]).toEqual(expectedActionBeginLoading);
    expect(dispatch.mock.calls[1]).toEqual(expectedAction);
}));
it('resendSignUp error', () => __awaiter(void 0, void 0, void 0, function* () {
    aws_amplify_1.Auth.resendSignUp = jest.fn().mockImplementation(() => {
        throw 'system error';
    });
    const expectedAction = [
        {
            type: 'AUTH_SYSTEM_ERROR',
            payload: 'system error',
        },
    ];
    yield index_1.resendSignUp('test@example.com')(dispatch);
    expect(aws_amplify_1.Auth.resendSignUp).toHaveBeenCalledWith('test@example.com');
    expect(dispatch.mock.calls[0]).toEqual(expectedActionBeginLoading);
    expect(dispatch.mock.calls[1]).toEqual(expectedAction);
}));
it('forgotPasswordSubmit success', () => __awaiter(void 0, void 0, void 0, function* () {
    aws_amplify_1.Auth.forgotPasswordSubmit = jest.fn();
    yield index_1.forgotPasswordSubmit('test@example.com', 'CD123', 'PW123')(dispatch);
    expect(aws_amplify_1.Auth.forgotPasswordSubmit).toHaveBeenCalledWith('test@example.com', 'CD123', 'PW123');
    expect(dispatch.mock.calls[0]).toEqual(expectedActionBeginLoading);
    expect(dispatch.mock.calls[1]).toEqual(expectedActionInit);
}));
it('forgotPasswordSubmit error', () => __awaiter(void 0, void 0, void 0, function* () {
    aws_amplify_1.Auth.forgotPasswordSubmit = jest.fn().mockImplementation(() => {
        throw 'system error';
    });
    const expectedAction = [
        {
            type: 'AUTH_SYSTEM_ERROR',
            payload: 'system error',
        },
    ];
    yield index_1.forgotPasswordSubmit('test@example.com', 'CD123', 'PW123')(dispatch);
    expect(aws_amplify_1.Auth.forgotPasswordSubmit).toHaveBeenCalledWith('test@example.com', 'CD123', 'PW123');
    expect(dispatch.mock.calls[0]).toEqual(expectedActionBeginLoading);
    expect(dispatch.mock.calls[1]).toEqual(expectedAction);
}));
it('forgotPassword success', () => __awaiter(void 0, void 0, void 0, function* () {
    aws_amplify_1.Auth.forgotPassword = jest.fn();
    const expectedAction = [
        {
            type: 'AUTH_FORGOT_PASSWORD_SUCCESS',
            payload: 'test@example.com',
        },
    ];
    yield index_1.forgotPassword('test@example.com')(dispatch);
    expect(aws_amplify_1.Auth.forgotPassword).toHaveBeenCalledWith('test@example.com');
    expect(dispatch.mock.calls[0]).toEqual(expectedActionBeginLoading);
    expect(dispatch.mock.calls[1]).toEqual(expectedAction);
}));
it('forgotPassword error', () => __awaiter(void 0, void 0, void 0, function* () {
    aws_amplify_1.Auth.forgotPassword = jest.fn().mockImplementation(() => {
        throw 'system error';
    });
    const expectedAction = [
        {
            type: 'AUTH_SYSTEM_ERROR',
            payload: 'system error',
        },
    ];
    yield index_1.forgotPassword('test@example.com')(dispatch);
    expect(aws_amplify_1.Auth.forgotPassword).toHaveBeenCalledWith('test@example.com');
    expect(dispatch.mock.calls[0]).toEqual(expectedActionBeginLoading);
    expect(dispatch.mock.calls[1]).toEqual(expectedAction);
}));
