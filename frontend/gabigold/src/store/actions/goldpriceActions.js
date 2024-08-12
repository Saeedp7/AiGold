import { BACKEND_URL } from "../../components/utils/api";

export const FETCH_GOLD_PRICE_REQUEST = 'FETCH_GOLD_PRICE_REQUEST';
export const FETCH_GOLD_PRICE_SUCCESS = 'FETCH_GOLD_PRICE_SUCCESS';
export const FETCH_GOLD_PRICE_ERROR = 'FETCH_GOLD_PRICE_ERROR';

// Action Creators
export const fetchGoldPriceRequest = () => ({
    type: FETCH_GOLD_PRICE_REQUEST
});

export const fetchGoldPriceSuccess = (goldPrice) => ({
    type: FETCH_GOLD_PRICE_SUCCESS,
    payload: goldPrice
});

export const fetchGoldPriceError = (error) => ({
    type: FETCH_GOLD_PRICE_ERROR,
    payload: error
});

// Thunk to fetch gold price
export const fetchGoldPrice = () => {
    return async (dispatch) => {
        dispatch(fetchGoldPriceRequest());
        try {
            const response = await fetch(`${BACKEND_URL}/shop/gold-price/`);
            const data = await response.json();
            dispatch(fetchGoldPriceSuccess(data.gold_price_per_gram));
        } catch (error) {
            dispatch(fetchGoldPriceError('Failed to fetch gold price'));
        }
    };
};
