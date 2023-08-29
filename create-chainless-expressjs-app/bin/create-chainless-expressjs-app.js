#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const generateContractCode = require('./generator');

// Create an ExpressJS application
function createExpressApp(appName, targetFolder) {
    const cmd = `npx express-generator ${appName}`;
    if (targetFolder) {
        execSync(cmd, { stdio: 'inherit', cwd: targetFolder });
    } else {
        execSync(cmd, { stdio: 'inherit' });
    }
}

// Add sample imports to app.js
function addImportsToAppJs(appPath, contractNames) {
    const appJSPath = path.join(appPath, 'app.js');
    let appJSContent = fs.readFileSync(appJSPath, 'utf-8');

    const sampleImports = [
        "var web3authHelper = require(i'./ChainlessJS/Web3authHelper');",
        "var web3Helper = require('./ChainlessJS/Web3Helper');",
        "var ipfsUtils = require('./ChainlessJS/IpfsUtils');"
    ];

    const contractImports = contractNames.map(name => `var ${name} = require('./ChainlessServer/${name}.js');`);
    appJSContent = sampleImports.concat(contractImports).join("\n") + "\n\n" + appJSContent;

    fs.writeFileSync(appJSPath, appJSContent);
}

// Copy the Web3 helper scripts to the target folder
function copyScripts(appPath) {
    const chainlessServerFolder = path.join(appPath, 'ChainlessServer');
    if (!fs.existsSync(chainlessServerFolder)) {
        fs.mkdirSync(chainlessServerFolder);
    }
    fs.copyFileSync(path.resolve(__dirname, '..', 'scripts', 'Web3Helper.js'), path.join(chainlessServerFolder, 'Web3Helper.js'));
    fs.copyFileSync(path.resolve(__dirname, '..', 'scripts', 'IpfsUtils.js'), path.join(chainlessServerFolder, 'IpfsUtils.js'));
}

// Copy contract ABIs and generate contract class JS scripts in the ChainlessServer folder
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
        const contractDest= path.join(abiFolder, path.basename(contract.path));
        fs.copyFileSync(contract.path, contractDest);
        const code = generateContractCode(contract.name, contract.address, contract.path);
        fs.writeFileSync(path.join(chainlessFolder, `${contract.name}.js`), code);
    });
}

// Install NPM dependencies
function installDependencies(appPath) {
    const dependencies = [
        'express@^4.18.2',
        'web3@^1.10.0',
        'ipfs-http-client@^60.0.1'
    ];

    execSync(`npm install ${dependencies.join(' ')}`, { stdio: 'inherit', cwd: appPath });
}

// main
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

    const config = JSON.parse(fs.readFileSync(JSONConfigPath, 'utf-8'));

    createExpressApp(appName, targetFolder);
    
    copyScripts(appPath);
    
    copyContracts(appPath, config);

    const contractNames = config.map(contract => contract.name);
    addImportsToAppJs(appPath, contractNames);

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
