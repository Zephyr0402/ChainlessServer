const fs = require('fs');
const path = require('path');

function generateContractCode(contractName, contractAddress, contractFilePath) {
    const contractJSON = JSON.parse(fs.readFileSync(contractFilePath, 'utf8'));

    // Start generating the skeleton
    let code = `import Web3 from 'web3';\n`;
    code += `import contractJSON from '../ABI/${path.basename(contractFilePath)}';\n`;  
    code += `export default class ${contractName} {\n`;
    code += `  constructor() {\n`;
    code += `     this.web3 = null;\n`;
    code += `     this.contract = null;\n`;
    code += `     this.contractAddress = '${contractAddress}';\n`;
    code += `  }\n`;
    code += `  createContractInstance(web3) {\n`;
    code += `      this.web3 = web3;\n`
    code += `      if (this.web3 == null) {\n`;
    code += `          return null;\n`;
    code += `      } else {\n`;
    code += `          this.contract = new web3.eth.Contract(contractJSON.abi, this.contractAddress);\n`;
    code += `          return this.contract;\n`;
    code += `      }\n`;
    code += `  }\n`;

    contractJSON.abi.forEach((method) => {
        if (method.type === 'function') {
            let params = (method.inputs || []).map((input) => input.name).join(', ');
        
            if (method.stateMutability === 'view' || method.stateMutability === 'pure') {
                code += `  async ${method.name}(${params}) {\n`;
                code += `     return await this.contract.methods.${method.name}(${params}).call();\n`;
                code += '  }\n';
            } else {
                code += `  async ${method.name}(senderAddress, ${params}) {\n`;
                code += `     return await this.contract.methods.${method.name}(${params}).send({ from: senderAddress });\n`;
                code += '  }\n';

                code += `  async ${method.name}_estimateGas(senderAddress, ${params}) {\n`;
                code += `     return await this.contract.methods.${method.name}(${params}).estimateGas({ from: senderAddress });\n`;
                code += '  }\n';
            }
        }
    });

    code += '}\n';

    return code;
}

module.exports = generateContractCode;
