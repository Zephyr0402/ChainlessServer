import fs from 'fs';
import Web3 from 'web3';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
  .option('a', { alias: 'contractAddress', type: 'string', demandOption: true, describe: 'The address of the contract' })
  .option('n', { alias: 'contractName', type: 'string', demandOption: true, describe: 'The name of the contract' })
  .option('p', { alias: 'contractFilePath', type: 'string', demandOption: true, describe: 'The file path to the contract' })
  .argv;

const web3 = new Web3('https://sepolia.infura.io/v3/b173276dc6b9424eb6fd20f4c910ebfa'); 

// Read ABI from file
const contractName = argv.contractName;
const contractAddress = argv.contractAddress;
const contractFilePath = argv.contractFilePath; // Todo: support multiple contract json paths
const contractABI = JSON.parse(fs.readFileSync(contractFilePath, 'utf8'));

// Initialize the contract
const contract = new web3.eth.Contract(contractABI.abi, contractAddress);

// Start generating the skeleton
let code = `import Web3 from 'web3';\n`;
code += `import fs from 'fs';\n`;
code += `class ` + contractName + ` {\n`;
code += `  constructor() {\n`;
code += `     const web3 = new Web3('https://sepolia.infura.io/v3/b173276dc6b9424eb6fd20f4c910ebfa');\n`;
code += `     const contractAddress = '` + contractAddress +  `';\n`;
code += `     const contractFilePath = '` + contractFilePath + `';\n`;
code += `     const contractABI = JSON.parse(fs.readFileSync(contractFilePath, 'utf8'));\n`;
code += `     this.contract = new web3.eth.Contract(contractABI.abi, contractAddress);\n`;
code += '  }\n';

contractABI.abi.forEach((method) => {
  if (method.type === 'function') {
    let params = (method.inputs || []).map((input) => input.name).join(', ');

    code += `  async ${method.name}(${params}) {\n`;

    if (method.constant) {
      // For constant function, use the call method
      code += `     return await this.contract.methods.${method.name}(${params}).call();\n`;
    } else {
      // For non-constant function, use the send method
      code += `     return await this.contract.methods.${method.name}(${params}).send({ from: '` + contractAddress + `' });\n`;
      code += '  }\n';
      code += `  async ${method.name}_estimateGas(${params}) {\n`;
      code += `     return await this.contract.methods.${method.name}(${params}).estimateGas({ from: '` + contractAddress + `' });\n`;
    }

    code += '  }\n';
  }
});

code += '}\n';

console.log(code);

// Write the generated code to a .js file named after the contract
fs.writeFileSync(`${contractName}.js`, code);
