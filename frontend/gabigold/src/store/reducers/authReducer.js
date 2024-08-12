const initialState = {
    isAuthenticated: false,
    user: null,
    error: null
};

export default function auth(state = initialState, action) {
    switch (action.type) {
        case 'REGISTER_SUCCESS':
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload,
                error: null
            };
        case 'REGISTER_FAIL':
        case 'LOGIN_FAIL':
        case 'LOGOUT':
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                error: action.payload
            };
        default:
            return state;
    }
}
