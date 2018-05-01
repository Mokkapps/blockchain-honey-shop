import React from 'react';
import styled from 'styled-components';

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

const Button = styled.button`
  align-self: center;
`;

const Product = ({ index, image, name, desc, price, defaultAmount, addToCart }) => (
  <Wrapper>
    <Image src={image} alt={name} />
    <Name>{name}</Name>
    <Price>Price: {price}</Price>
    <Desc>Description: {desc}</Desc>
    <Button onClick={() => addToCart(index)}>Add To Cart</Button>
  </Wrapper>
);

export default Product;
