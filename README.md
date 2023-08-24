# ChainlessServer
ChainlessServer is a NPM library used for server side of web application, targeted for developers who don't have Web3 knowledge to seamlessly migrate or create their own Web3 games.

# Design
It is designed that the developer can use ChainlessServer to directly access the web3 methods with web2 style API. The built-in http server is ExpressJS.

1. User initalize a project structure and generate skeleton code by reading abis of smart contract.
2. Generate methods based on abis
3. Generate ExpressJS file structure
4. Initialize Agent (an instance of chainless class) with user account address and smart contract address

# Current problem

* Is there a need intergrate a HTTP server inside backend library? multi-http server support using Yeoman
* Database connection built-in or let user choose?
* Multi-smart contracts (NFT and others...)
* Read from ipfs (metadata, pic uri...)

# Demo command
create-chainless-expressjs-app mydemoapp ../demo/SampleJSON/SampleContracts.json ../demo