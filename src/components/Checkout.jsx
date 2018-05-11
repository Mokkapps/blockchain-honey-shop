import React from 'react';
import styled from 'styled-components';

import Product from './Product';
import Button from './Button';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const ProductWrapper = styled.section`
  flex-grow: 2;
  margin: 5px;
  padding: 5px;
  background: black;
`;

const Amount = styled.p`
  padding: 10px;
  flex: 0 1 auto;
  font-size: 2rem;
  font-weight: bold;
`;

const Checkout = ({ cart, removeFromCart, addToCart }) => {
  const cartList = cart.map(c => (
    <Wrapper key={c.product.id}>
      <Amount>{c.amount}x</Amount>
      <ProductWrapper>
        <Product
          key={c.product.id}
          product={c.product}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
        />
      </ProductWrapper>
    </Wrapper>
  ));
  const list = cartList.length === 0 ? <p>No items in cart</p> : <ul>{cartList}</ul>;

  return (
    <div>
      <h1>Checkout</h1>
      {list}
      <Button text={'Checkout'} onClick={() => console.log('CHECKOUT')} />
    </div>
  );
};

export default Checkout;
