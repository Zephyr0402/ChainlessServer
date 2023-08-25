#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const generateContractCode = require('./generator');

function createExpressApp(appName, targetFolder) {
    const command = `npx express-generator ${appName}`;
    if (targetFolder) {
        execSync(command, { stdio: 'inherit', cwd: targetFolder });
    } else {
        execSync(command, { stdio: 'inherit' });
    }
}

function copyScripts(appPath) {
    const chainlessServerFolder = path.join(appPath, 'ChainlessServer');
    if (!fs.existsSync(chainlessServerFolder)) {
        fs.mkdirSync(chainlessServerFolder);
    }
    fs.copyFileSync(path.resolve(__dirname, '..', 'scripts', 'Web3Helper.js'), path.join(chainlessServerFolder, 'Web3Helper.js'));
    fs.copyFileSync(path.resolve(__dirname, '..', 'scripts', 'IpfsUtils.js'), path.join(chainlessServerFolder, 'IpfsUtils.js'));
}

function copyContracts(appPath, contracts) {
    const abiFolder = path.join(appPath, 'ABI');
    if (!fs.existsSync(abiFolder)) {
        fs.mkdirSync(abiFolder);
    }

    const chainlessFolder = path.join(appPath, 'ChainlessServer');
    if (!fs.existsSync(chainlessFolder)) {
        fs.mkdirSync(chainlessFolder);
    }

    contracts.forEach(contract => {
        const contractDestination = path.join(abiFolder, path.basename(contract.path));
        fs.copyFileSync(contract.path, contractDestination);
        const code = generateContractCode(contract.name, contract.address, contract.path);
        fs.writeFileSync(path.join(chainlessFolder, `${contract.name}.js`), code);
    });
}

function installDependencies(appPath) {
    const dependencies = [
        'express@^4.18.2',
        'web3@^1.10.0',
        'ipfs-http-client'
    ];

    execSync(`npm install ${dependencies.join(' ')}`, { stdio: 'inherit', cwd: appPath });
}

function main() {
    if (process.argv.length < 4) {
        console.error('Please provide an app name and path to the JSON configuration file.');
        process.exit(1);
    }

    const appName = process.argv[2];
    const JSONConfigPath = process.argv[3];
    const targetFolder = process.argv[4] || process.cwd();
    const appPath = path.join(targetFolder, appName);

    if (fs.existsSync(appPath)) {
        console.error(`Error: The target directory "${appPath}" already exists. Please choose a different name or directory.`);
        process.exit(1);
    }

    const rawConfig = fs.readFileSync(JSONConfigPath, 'utf-8');
    const config = JSON.parse(rawConfig);

    createExpressApp(appName, targetFolder);
    
    copyScripts(appPath);
    
    copyContracts(appPath, config);

    installDependencies(appPath);
}

if (require.main === module) {
    main();
}

module.exports = {
    createExpressApp,
    copyScripts,
    copyContracts,
    installDependencies
};
