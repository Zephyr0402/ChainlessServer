# ChainlessServer
ChainlessServer is a NPM library used for server side of web application, targeted for developers who don't have Web3 knowledge to seamlessly migrate or create their own Web3 games.

# Design
It is designed that the developer can use ChainlessServer to directly access the web3 methods with web2 style API. The built-in http server is ExpressJS.

1. User initalize a project structure and generate skeleton code by reading abis of smart contract.
2. Generate methods based on abis
3. Generate ExpressJS file structure
4. Generate Web3Helper.js and IpfsUtils.js file

# How to deploy smart contracts (Optional, the demo-used contracts are deployed in advanced)
1. Instal npm dependencies

<code>cd contracts/GobangUserProfile</code>

<code>npm install</code>

2. Enter your mnemonic in the truffle-config.js

<code>vim truffle-config.js</code>

3. Compile and migrate the smart contract

<code>truffle compile</code>

<code>truffle migrate --network matic</code>

4. Repeat the steps for MemoryGameProfile smart contract

# Setup smart contract JSON files first
The library assumes that the user has compiled and deployed. The contract name, deployed address on the blockchain and contract JSON file should be stored in a seperated JSON file following the format of the <code>demo/SampleJSON/SampleContracts.json</code>.

# How to run it under local development environment

<code>cd create-chainless-expressjs-app</code>

<code>npm install</code>

<code>npm link</code>

<code>create-chainless-expressjs-app mydemoapp ../demo/SampleJSON/SampleContracts.json ../demo</code>

# How to run test

<code>cd create-chainless-expressjs-app</code>

<code>npm test</code>

# Get the library from npmjs.com ([create-chainless-expressjs-app](https://www.npmjs.com/package/create-chainless-expressjs-app))

<code>cd demo/</code>

<code>npm i create-chainless-expressjs-app</code>

<code>create-chainless-expressjs-app mydemoapp-from-npm ./SampleJSON/SampleContracts.json ./</code>