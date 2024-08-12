import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
  cartTotal: 0,
  cartQuantity: 0,
  cartId: ''
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action) => {
        const cartData = action.payload;
        state.cartItems = cartData || [];
        state.cartTotal = cartData.reduce((total, item) => total + parseFloat(item.price), 0).toFixed(2);
        state.cartQuantity = cartData.length;
        if (cartData.length > 0) {
          state.cartId = cartData[0].cart; // Assuming all items belong to the same cart
        }
      },
    addToCart: (state, action) => {
      const newItem = action.payload;
      state.cartId = action.payload.cart_id;
      const existingItem = state.cartItems.find(item => item.id === newItem.id);
      if (!existingItem) {
        state.cartItems.push(newItem);
      } else {
        throw new Error("Item already in cart");
      }
      let total = 0;
      state.cartItems.forEach(item => {
        total += parseFloat(item.price);
      });
      state.cartQuantity = state.cartItems.length;
      state.cartTotal = total.toFixed(2);
    },
    updateCart: (state, action) => {
      const newItem = action.payload;
      const newCartItems = state.cartItems.map(item => (item.id === newItem.id ? newItem : item));
      state.cartItems = newCartItems;
      let total = 0;
      state.cartItems.forEach(item => {
        total += parseFloat(item.price);
      });
      state.cartQuantity = state.cartItems.length;
      state.cartTotal = total.toFixed(2);
    },
    deleteItem: (state, action) => {
      const newCartItems = state.cartItems.filter(item => item.id !== action.payload.id);
      state.cartItems = newCartItems;
      state.cartQuantity = state.cartItems.length;
      let total = 0;
      state.cartItems.forEach(item => {
        total += parseFloat(item.price);
      });
      state.cartTotal = total.toFixed(2);
    },
    resetCart: (state) => {
      state.cartItems = [];
      state.cartTotal = 0;
      state.cartQuantity = 0;
      state.cartId = '';
    },
  }
});

export const cartActions = cartSlice.actions;
export default cartSlice.reducer;
