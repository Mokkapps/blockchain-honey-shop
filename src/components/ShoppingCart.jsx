import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  margin-right: 20px;
`;

const Image = styled.img`
  width: 40px;
  height: 40px;
  align-self: center;
  margin-right: 10px;
`;

const Count = styled.span`
  color: white;
  align-self: center;
`;

const ShoppingCart = ({ count }) => (
  <Wrapper>
    <Image src="./shopping-cart.png" alt="Checkout" />
    <Count>{count || 0}</Count>
  </Wrapper>
);

export default ShoppingCart;
