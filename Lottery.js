import Web3 from 'web3';
class Lottery {
  constructor() {
     const web3 = new Web3('https://sepolia.infura.io/v3/b173276dc6b9424eb6fd20f4c910ebfa');
     const contractAddress = '0x5E015FF9813d318516DfC46F9843DCd2aF6D12C0';
     const contractFilePath = '../Lottery/build/contracts/Lottery.json';
     const contractJSON = JSON.parse(fs.readFileSync(contractFilePath, 'utf8'));
     this.contract = new web3.eth.Contract(SimpleStorage.abi, contractAddress);
  }
  async manager() {
     return await this.contract.methods.manager().call();
  }
  async players() {
     return await this.contract.methods.players().call();
  }
  async enter() {
     return await this.contract.methods.enter().send({ from: '0x5E015FF9813d318516DfC46F9843DCd2aF6D12C0' });
  }
  async enter_estimateGas() {
     return await this.contract.methods.enter().estimateGas({ from: '0x5E015FF9813d318516DfC46F9843DCd2aF6D12C0' });
  }
  async pickWinner() {
     return await this.contract.methods.pickWinner().send({ from: '0x5E015FF9813d318516DfC46F9843DCd2aF6D12C0' });
  }
  async pickWinner_estimateGas() {
     return await this.contract.methods.pickWinner().estimateGas({ from: '0x5E015FF9813d318516DfC46F9843DCd2aF6D12C0' });
  }
  async getPlayers() {
     return await this.contract.methods.getPlayers().call();
  }
}
