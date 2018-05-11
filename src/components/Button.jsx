import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  text-transform: uppercase;
  background: none;
  border: 1px solid #000;
  font-weight: 600;
  font-size: 1.5rem;
  font-family: 'Open Sans';
  -webkit-transition: all 0.2s;
  transition: all 0.2s;
  position: relative;
  z-index: 2;

  &:focus,
  &:hover {
    color: #fff;
    outline: 0;

    &:after {
      height: 100%;
    }
  }

  &:after {
    content: '';
    z-index: -1;
    display: block;
    background: #000;
    position: absolute;
    width: 100%;
    height: 0;
    left: 0;
    top: 0;
    -webkit-transition: all 0.2s;
    transition: all 0.2s;
  }
`;

const Button = ({ text, onClick }) => <StyledButton onClick={onClick}>{text}</StyledButton>;

export default Button;
