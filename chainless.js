// Agent.js is used to maintain a connection between server and blockchain network
// Designed to handle multiple login users 
const { Web3 } = require('web3'); 

class Chainless {
  constructor(rpcURL, address, abi) {
    // Make connection to the blockchain network
    this.web3 = new Web3(rpcURL);
    //this.contract = new this.web3.eth.Contract(abi, address);
  }

  // Check if the blockchain connection still exists
  async isAlive() {
    try {
      await this.web3.eth.net.isListening();
      console.log("Is connected")
      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  }

  async getAccountBalance(address) {
    // Retrieve the balance for the specified address
    try {
      const balance = await this.web3.eth.getBalance(address);
      console.log('Account balance:', this.web3.utils.fromWei(balance, 'ether'), 'ETH');
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async addData() {
    // Add data to the blockchain
  }

  async updateData() {
    // Update data on the blockchain
  }

  async deleteData() {
    // Delete data from the blockchain
  }
}

module.exports = Chainless;
