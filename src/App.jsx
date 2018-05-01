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

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      web3: {
        shopInstance: undefined,
        account: undefined,
        provider: undefined
      },
      cart: [],
      storeName: '-',
      products: []
    };
  }

  componentWillMount() {
    const product1 = {
      id: 1,
      name: 'Honig 1',
      desc: 'Lecker 1',
      price: 1,
      defaultAmount: 1,
      image: './box-img-lg.png'
    };

    const product2 = {
      id: 2,
      name: 'Honig 2',
      desc: 'Lecker 2',
      price: 2,
      defaultAmount: 2,
      image: '../box-img-lg.png'
    };

    this.setState({
      storeName: 'Hoffmann Honey Shop',
      products: [product1, product2]
    });

    // Get network provider and web3 instance.
    getWeb3
      .then(results => {
        this.setState({
          web3: {
            provider: results.web3
          }
        });

        this.instantiateContract();
      })
      .catch(() => {
        console.error('Error finding web3.');
        // alert('Error finding web3.');
      });
  }

  instantiateContract() {
    const honeyShop = contract(HoneyShopContract);
    honeyShop.setProvider(this.state.web3.currentProvider);

    this.state.web3.eth.getAccounts(async (error, accounts) => {
      const instance = await honeyShop.deployed();
      web3.eth.defaultAccount = accounts[0];

      const shopContract = web3.eth.contract(JSON.stringify(instance.abi));
      const storeName = await instance.storeName();
      this.setState({ shopInstance: instance, account: web3.eth.defaultAccount });
    });
  }

  getProductObj = (product, id, image) => {
    const { web3 } = this.state;
    const name = web3.toAscii(product[0]);
    const desc = web3.toAscii(product[1]);
    const price = new web3.toBigNumber(product[2]).toNumber();
    const defaultAmount = new web3.toBigNumber(product[3]).toNumber();

    console.log('product', { id, name, desc, price, defaultAmount, image });

    return { id, name, desc, price, defaultAmount, image };
  };

  registerCustomer = async () => {
    const {
      web3: { account, shopInstance }
    } = this.state;
    await shopInstance.registerCustomer(account, 'Michael Hoffmann', 100, {
      from: account
    });
  };

  registerProduct = async ({ id, name, desc, price, defaultAmount }) => {
    console.log('registerProduct', id, name, desc, price, defaultAmount);
    const {
      web3: { account, shopInstance }
    } = this.state;
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
  };

  removeFromCart = index => {
    const { products, cart } = this.state;

    const cartEntry = cart.find(c => c.product.id === index);
    if (cartEntry && cartEntry.amount > 0) {
      cartEntry.amount = cartEntry.amount - 1;
    }

    this.setState({ cart });
    console.log('Remove from cart', index, cart[cartsIndex]);
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
