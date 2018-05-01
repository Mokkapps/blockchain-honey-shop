import React from 'react';
import styled from 'styled-components';

import ShoppingCart from './ShoppingCart';

const NavBar = styled.nav`
  position: fixed;
  padding: 5px;
  background: #0c1a2b;
  font-family: 'Oswald', 'Arial Narrow', sans-serif;
  display: flex;
  justify-content: space-between;

  & .pure-menu-heading {
    font-weight: bold;
    text-transform: none;
  }

  & .navbar-right {
    float: right;
  }

  & .uport-logo {
    height: 16px;
    margin-right: 10px;
  }
`;

const NavBarLink = styled.a`
  color: #fffff;

  &:active,
  &:focus,
  &:hover {
    background: #233e5e;
  }
`;

const Header = ({ name, cart }) => {
  const count = Object.values(cart)
    .map(c => c.amount)
    .reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);

  return (
    <NavBar className="pure-menu pure-menu-horizontal">
      <NavBarLink href="/" className="pure-menu-heading pure-menu-link">
        {name}
      </NavBarLink>
      <ShoppingCart count={count} />
    </NavBar>
  );
};

export default Header;
