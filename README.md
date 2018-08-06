**IMPORTANT: This was a fun project which was never finished and is no longer in development**

# Blockchain Honey Shop

<img src="https://cdn.pixabay.com/photo/2015/06/27/16/35/honey-823614_1280.jpg" width="250">
<img src="https://cdn.pixabay.com/photo/2017/12/31/11/57/block-chain-3052119_1280.png" width="250">

World's 1st dezentralized honey shop on the Ethereum blockchain

Bootstrapped with [React Truffle Box](http://truffleframework.com/boxes/react).

# Getting started

1. Clone repo and install dependencies

```javascript
npm install
```

2. Open [Ganache](http://truffleframework.com/ganache/)

3. Compile & migrate contract

```javascript
truffle compile
```

```javascript
truffle migrate --network ganache
```
4. Run web app

```javascript
npm run start
```

5. Open web app. Make sure that your browser uses the [MetaMask browser extension](http://truffleframework.com/docs/advanced/truffle-with-metamask).

6. Interact from the web with your smart contract on the blockchain.

# Contract tests

1. Repeat steps 1-3 from above
2. Run the tests
```javascript
truffle test --network ganache
```

# More documentation

This box is a marriage of [Truffle](http://truffleframework.com/) and a React setup created with [create-react-app](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md). Either one would be a great place to start!
