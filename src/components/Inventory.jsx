import React from 'react';
import styled from 'styled-components';

import Product from './Product';

const Wrapper = styled.section`
  padding: 2em;
  background: cadetblue;
`;

const ProductList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const Inventory = ({ products, addToCart }) => {
  const productList = products.map(product => (
    <Product key={product.id} index={product.id} {...product} addToCart={addToCart} />
  ));
  return (
    <div>
      <h1>Available products</h1>
      <Wrapper>
        <ProductList>{productList}</ProductList>
      </Wrapper>
    </div>
  );
};

export default Inventory;
