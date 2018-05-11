import React from 'react';
import contract from 'truffle-contract';
import styled from 'styled-components';
import { BrowserRouter, Route } from 'react-router-dom';

import getWeb3 from './utils/getWeb3';
import HoneyShopContract from '../build/contracts/HoneyShop.json';
import Header from './components/Header';
import Inventory from './components/Inventory';
import Checkout from './components/Checkout';

import './css/oswald.css';
import './css/open-sans.css';
import './css/pure-min.css';
import './App.css';

const LOCAL_STORAGE_KEY = 'HONEY_SHOP';

const TEST_PRODUCT_1 = {
  id: 1,
  name: 'Honig 1',
  desc: 'Lecker 1',
  price: 1,
  defaultAmount: 1,
  image: './honey.png'
};

const TEST_PRODUCT_2 = {
  id: 2,
  name: 'Honig 2',
  desc: 'Lecker 2',
  price: 2,
  defaultAmount: 2,
  image: '../honey.png'
};

class App extends React.Component {
  web3;
  shopInstance;

  constructor(props) {
    super(props);

    const localStorageState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (localStorageState) {
      const { cart, storeName, products } = JSON.parse(localStorageState);
      this.state = {
        cart,
        storeName,
        products
      };
    } else {
      this.state = {
        cart: [],
        storeName: 'Hoffmann Honey Shop',
        products: [TEST_PRODUCT_1, TEST_PRODUCT_2]
      };
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    getWeb3
      .then(results => {
        this.instantiateContract();
      })
      .catch(() => {
        console.error('Error finding web3.');
        // alert('Error finding web3.');
      });
  }

  instantiateContract() {
    const honeyShop = contract(HoneyShopContract);
    honeyShop.setProvider(web3.currentProvider);

    web3.eth.getAccounts(async (error, accounts) => {
      const instance = await honeyShop.deployed();
      web3.eth.defaultAccount = accounts[0];

      const shopContract = web3.eth.contract(JSON.stringify(instance.abi));
      const storeName = await instance.storeName();
    });
  }

  getProductObj = (product, id, image) => {
    const name = web3.toAscii(product[0]);
    const desc = web3.toAscii(product[1]);
    const price = new web3.toBigNumber(product[2]).toNumber();
    const defaultAmount = new web3.toBigNumber(product[3]).toNumber();

    console.log('product', { id, name, desc, price, defaultAmount, image });
    return { id, name, desc, price, defaultAmount, image };
  };

  registerCustomer = async () => {
    await shopInstance.registerCustomer(account, 'Michael Hoffmann', 100, {
      from: account
    });
  };

  registerProduct = async ({ id, name, desc, price, defaultAmount }) => {
    console.log('registerProduct', id, name, desc, price, defaultAmount);
    await shopInstance.registerProduct(id, name, desc, price, defaultAmount, {
      from: account
    });
  };

  addToCart = index => {
    const { products, cart } = this.state;
    const productToAdd = products.find(p => p.id === index);
    if (!productToAdd) {
      console.error(
        `Cannot add product with ID ${index} as it is not in available products: ${JSON.stringify(
          products
        )}`
      );
      return;
    }

    const cartEntry = cart.find(c => c.product.id === productToAdd.id);
    if (cartEntry) {
      cartEntry.amount = cartEntry.amount + 1;
    } else {
      cart.push({ product: productToAdd, amount: 1 });
    }

    this.setState({ cart });
    console.log('Add to cart', index, productToAdd);
    console.log({ ...this.state });
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ ...this.state }));
  };

  removeFromCart = index => {
    const { products, cart } = this.state;

    const cartEntry = cart.find(c => c.product.id === index);
    if (cartEntry && cartEntry.amount > 0) {
      cartEntry.amount = cartEntry.amount - 1;
    }

    this.setState({ cart });
    console.log('Remove from cart', index, cart[cartsIndex]);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ ...this.state }));
  };

  render() {
    const { storeName, cart, products } = this.state;

    return (
      <BrowserRouter>
        <div className="App">
          <Header name={storeName} cart={cart} />
          <main className="container">
            <div className="pure-g">
              <div className="pure-u-1-1">
                <Route
                  exact
                  path="/"
                  render={props => (
                    <Inventory {...props} products={products} addToCart={this.addToCart} />
                  )}
                />
                <Route
                  path="/cart"
                  render={props => (
                    <Checkout
                      {...props}
                      cart={cart}
                      addToCart={this.addToCart}
                      removeFromCart={this.removeFromCart}
                    />
                  )}
                />
              </div>
            </div>
          </main>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
