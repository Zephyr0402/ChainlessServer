import Web3 from 'web3';
class GobangUserProfile {
  constructor() {
     const web3 = new Web3('https://sepolia.infura.io/v3/b173276dc6b9424eb6fd20f4c910ebfa');
     const contractAddress = '0xe98f8E4A27bfF93AD31fd24ec5d6f4dA7caBFAD6';
     const contractFilePath = '../EECE597Demo/contract/GobangUserProfile/build/contracts/GobangUserProfile.json';
     const contractJSON = JSON.parse(fs.readFileSync(contractFilePath, 'utf8'));
     this.contract = new web3.eth.Contract(SimpleStorage.abi, contractAddress);
  }
  async profiles() {
     return await this.contract.methods.profiles().call();
  }
  async createUserProfile(userAddress, username) {
     return await this.contract.methods.createUserProfile(userAddress, username).send({ from: '0xe98f8E4A27bfF93AD31fd24ec5d6f4dA7caBFAD6' });
  }
  async createUserProfile_estimateGas(userAddress, username) {
     return await this.contract.methods.createUserProfile(userAddress, username).estimateGas({ from: '0xe98f8E4A27bfF93AD31fd24ec5d6f4dA7caBFAD6' });
  }
  async incrementMatchCount(userAddress) {
     return await this.contract.methods.incrementMatchCount(userAddress).send({ from: '0xe98f8E4A27bfF93AD31fd24ec5d6f4dA7caBFAD6' });
  }
  async incrementMatchCount_estimateGas(userAddress) {
     return await this.contract.methods.incrementMatchCount(userAddress).estimateGas({ from: '0xe98f8E4A27bfF93AD31fd24ec5d6f4dA7caBFAD6' });
  }
  async incrementWinningCount(userAddress) {
     return await this.contract.methods.incrementWinningCount(userAddress).send({ from: '0xe98f8E4A27bfF93AD31fd24ec5d6f4dA7caBFAD6' });
  }
  async incrementWinningCount_estimateGas(userAddress) {
     return await this.contract.methods.incrementWinningCount(userAddress).estimateGas({ from: '0xe98f8E4A27bfF93AD31fd24ec5d6f4dA7caBFAD6' });
  }
  async updateRank(userAddress, newRank) {
     return await this.contract.methods.updateRank(userAddress, newRank).send({ from: '0xe98f8E4A27bfF93AD31fd24ec5d6f4dA7caBFAD6' });
  }
  async updateRank_estimateGas(userAddress, newRank) {
     return await this.contract.methods.updateRank(userAddress, newRank).estimateGas({ from: '0xe98f8E4A27bfF93AD31fd24ec5d6f4dA7caBFAD6' });
  }
  async updateUserProfile(userAddress, username, matchCount, winningCount, rank) {
     return await this.contract.methods.updateUserProfile(userAddress, username, matchCount, winningCount, rank).send({ from: '0xe98f8E4A27bfF93AD31fd24ec5d6f4dA7caBFAD6' });
  }
  async updateUserProfile_estimateGas(userAddress, username, matchCount, winningCount, rank) {
     return await this.contract.methods.updateUserProfile(userAddress, username, matchCount, winningCount, rank).estimateGas({ from: '0xe98f8E4A27bfF93AD31fd24ec5d6f4dA7caBFAD6' });
  }
  async getUserProfile(userAddress) {
     return await this.contract.methods.getUserProfile(userAddress).call();
  }
}
