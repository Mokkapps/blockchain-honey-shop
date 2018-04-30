import React from 'react';
import HoneyShopContract from '../build/contracts/HoneyShop.json';
import getWeb3 from './utils/getWeb3';

import './css/oswald.css';
import './css/open-sans.css';
import './css/pure-min.css';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      web3: null
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
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract');
    const honeyShop = contract(HoneyShopContract);
    honeyShop.setProvider(this.state.web3.currentProvider);

    // Declaring this for later so we can chain functions on SimpleStorage.
    var honeyShopInstance;

    // Get open status.
    this.state.web3.eth.getAccounts((error, accounts) => {
      honeyShop
        .deployed()
        .then(instance => {
          honeyShopInstance = instance;
          return honeyShopInstance.isOpen();
        })
        .then(result => {
          return this.setState({ isOpen: result });
        });
    });
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <a href="#" className="pure-menu-heading pure-menu-link">
            Truffle Box
          </a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Honey Shop</h1>
              <p>Is store open? : {this.state.isOpen.toString()}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
