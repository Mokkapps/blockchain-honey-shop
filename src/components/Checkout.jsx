import React from 'react';
import styled from 'styled-components';

const Checkout = ({ cart, removeFromCart, addToCart }) => {
  const cartList = cart.map(c => (
    <li key={c.product.id}>
      {c.product.name}, Amount: {c.amount}
      <button onClick={() => addToCart(c.product.id)}>+</button>
      <button onClick={() => removeFromCart(c.product.id)}>-</button>
    </li>
  ));
  const list = cartList.length === 0 ? <p>No items in cart</p> : <ul>{cartList}</ul>;
  return (
    <div>
      <h1>Checkout</h1>
      {list}
    </div>
  );
};

export default Checkout;
