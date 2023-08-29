const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { createExpressApp, copyScripts, copyContracts, installDependencies, } = require('../bin/create-chainless-expressjs-app'); 

jest.mock('../bin/generator', () => jest.fn(() => 'mock code'));
jest.mock('fs');
jest.mock('child_process');
jest.mock('path');

describe('create-chainless-expressjs-app functions', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        path.join.mockImplementation((...args) => args.join('/'));
    });

    describe('createExpressApp', () => {
        it('The function should run the express-generator command', () => {
            const appName = 'testApp';
            const targetFolder = './testApp';
            const expectedCommand = `npx express-generator ${appName}`;

            createExpressApp(appName, targetFolder);

            expect(execSync).toHaveBeenCalledWith(expectedCommand, { stdio: 'inherit', cwd: targetFolder });
        });
    });

    describe('copyScripts', () => {
        it('The function should create a ChainlessServer directory in the ExpressJS folder if it does not exist', () => {
            fs.existsSync.mockReturnValue(false);
            copyScripts('./testApp');
            expect(fs.mkdirSync).toHaveBeenCalledWith('./testApp/ChainlessServer');
        });

        it('The function should copy Web3Helper.js and IpfsUtils.js to the ChainlessServer directory', () => {
            copyScripts('./testApp');
            expect(fs.copyFileSync).toHaveBeenCalledTimes(2);
        });
    });

    describe('copyContracts', () => {
        const mockContractConfig = [
            { 
                path: '../tests/contracts.test/contract1.json', 
                address: '0x12345678', 
                name: 'Contract1'
            },
            { 
                path: '../tests/contracts.test/contract2.json', 
                address: '0x23456789', 
                name: 'Contract2'
            },
        ];

        it('The function should create an ABI directory in the ExpressJS folder if it does not exist', () => {
            fs.existsSync.mockReturnValue(false);
            copyContracts('./testApp', mockContractConfig);
            expect(fs.mkdirSync).toHaveBeenCalledWith('./testApp/ABI');
        });

        it('The function should copy smart contract ABI JSON files to the ABI directory', () => {
            copyContracts('./testApp', mockContractConfig);
            expect(fs.copyFileSync).toHaveBeenCalledTimes(mockContractConfig.length);
        });

        it('The function should generate javascript class files for each contract and copy them to the ChainlessServer folder', () => {
            copyContracts('./testApp', mockContractConfig);
            expect(fs.copyFileSync).toHaveBeenCalledTimes(mockContractConfig.length);
            expect(fs.writeFileSync).toHaveBeenCalledWith('./testApp/ChainlessServer/Contract1.js', expect.any(String));
            expect(fs.writeFileSync).toHaveBeenCalledWith('./testApp/ChainlessServer/Contract2.js', expect.any(String));
        });
    });

    describe('installDependencies', () => {
        it('The function should install the necessary NPM packages', () => {
            const appPath = './testApp';
            const expectedDeps = [
                'express@^4.18.2',
                'web3@^1.10.0',
                'ipfs-http-client@^52.0.0'
            ];

            installDependencies(appPath);

            expect(execSync).toHaveBeenCalledWith(`npm install ${expectedDeps.join(' ')}`, { stdio: 'inherit', cwd: appPath });
        });
    });
});

