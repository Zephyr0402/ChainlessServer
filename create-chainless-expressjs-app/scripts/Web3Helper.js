import Web3 from 'web3';

export class Web3Helper {
    constructor() {
        this.web3 = null;
        this.authProvider = null;
    }

    getWeb3Instance() {
        return this.web3;
    }

    createWeb3Instance(authProvider) {
        this.authProvider = authProvider;
        this.web3 = new Web3(this.authProvider);
        return this.web3;
    }

    checkWeb3() {
        if (this.web3 == null) {
            return false; 
        } else {
            return true;
        }
    }

    async getNetworkId() {
        if (!this.checkWeb3()) {
            return null;
        } else {
            const networkId = await this.web3.eth.net.getId();
            return networkId;
        }
    }

    async getAccounts() {
        if (!this.checkWeb3()) {
            return null;
        } else {
            console.log(this.web3);
            const userAccounts = await this.web3.eth.getAccounts();
            return userAccounts;
        }
    }

    async getBalance(address) {
        if (!this.checkWeb3()) {
            return null;
        } else {
            const balance = await this.web3.eth.getBalance(address);
            return this.web3.utils.fromWei(balance, 'ether');
        }
    }

}