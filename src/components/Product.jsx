import React from 'react';
import styled from 'styled-components';

import Button from './Button';

const Wrapper = styled.li`
  padding: 1em;
  background: white;
  display: flex;
  justify-content: space-around;
`;

const Image = styled.img`
  align-self: center;
  width: 150px;
  height: 150px;
`;

const Name = styled.span`
  align-self: center;
`;

const Price = styled.span`
  align-self: center;
`;

const Desc = styled.p`
  align-self: center;
`;

const Product = ({ product, addToCart, removeFromCart }) => {
  const { image, name, price, desc, id } = product;
  return (
    <Wrapper>
      <Image src={image} alt={name} />
      <Name>{name}</Name>
      <Price>Price: {price}</Price>
      <Desc>Description: {desc}</Desc>
      <Button text={'Add To Cart'} onClick={() => addToCart(id)} />
      {removeFromCart ? (
        <Button text={'Remove From Cart'} onClick={() => removeFromCart(id)} />
      ) : null}
    </Wrapper>
  );
};

export default Product;
