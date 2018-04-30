import React from 'react';
import contract from 'truffle-contract';
import styled from 'styled-components';

import getWeb3 from './utils/getWeb3';
import HoneyShopContract from '../build/contracts/HoneyShop.json';
import Header from './components/Header';
import Product from './components/Product';

import './css/oswald.css';
import './css/open-sans.css';
import './css/pure-min.css';
import './App.css';

const Wrapper = styled.section`
  padding: 2em;
  background: cadetblue;
`;

const ProductList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      shopInstance: undefined,
      account: undefined,
      products: [],
      storeName: '-',
      web3: undefined
    };
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.
    getWeb3
      .then(results => {
        this.setState({
          web3: results.web3
        });

        // Instantiate contract once web3 provided.
        this.instantiateContract();
      })
      .catch(() => {
        console.error('Error finding web3.');
        alert('Error finding web3.');
      });
  }

  instantiateContract() {
    const honeyShop = contract(HoneyShopContract);
    honeyShop.setProvider(this.state.web3.currentProvider);

    this.state.web3.eth.getAccounts(async (error, accounts) => {
      const { web3 } = this.state;
      const instance = await honeyShop.deployed();

      web3.eth.defaultAccount = accounts[0];

      const shopContract = web3.eth.contract(JSON.stringify(instance.abi));

      const storeName = await instance.storeName();
      this.setState({ shopInstance: instance, account: web3.eth.defaultAccount });

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
        storeName,
        products: [product1, product2]
      });
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
    const { shopInstance, account } = this.state;
    await shopInstance.registerCustomer(account, 'Michael Hoffmann', 100, {
      from: account
    });
  };

  registerProduct = async ({ id, name, desc, price, defaultAmount }) => {
    console.log('registerProduct', id, name, desc, price, defaultAmount);
    const { shopInstance, account } = this.state;
    await shopInstance.registerProduct(id, name, desc, price, defaultAmount, {
      from: account
    });
  };

  addToOrder = index => {
    console.log('Add to order', index);
  };

  render() {
    const { storeName, web3, products } = this.state;
    const productList = products.map(product => (
      <Product key={product.id} index={product.id} {...product} addToOrder={this.addToOrder} />
    ));

    return (
      <div className="App">
        <Header name={storeName} />
        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              {!web3 ? <p>Web3 nicht verbunden, bitte via MetaMask verbinden.</p> : null}
              <h1>Available products</h1>
              <Wrapper>
                <ProductList>{productList}</ProductList>
              </Wrapper>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
