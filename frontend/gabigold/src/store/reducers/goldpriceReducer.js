const initialGoldState = {
    goldPrice: null,
    loading: false,
    error: null
};

export default function goldReducer(state = initialGoldState, action) {
    switch (action.type) {
        case 'FETCH_GOLD_PRICE_REQUEST':
            return {
                ...state,
                loading: true,
                error: null
            };
        case 'FETCH_GOLD_PRICE_SUCCESS':
            return {
                ...state,
                goldPrice: action.payload,
                loading: false
            };
        case 'FETCH_GOLD_PRICE_ERROR':
            return {
                ...state,
                error: action.payload,
                loading: false
            };
        default:
            return state;
    }
}