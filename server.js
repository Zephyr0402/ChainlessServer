const express = require('express');
const server = express();
const chainless = require('./chainless');
const agent = new chainless('https://sepolia.infura.io/v3/b173276dc6b9424eb6fd20f4c910ebfa', '', '');
const port = 3000;

// var connectionRouter = require('./routes/connection');
// var loginRouter = require('./routes/login');
// var manageDataRouter = require('./routes/manageData');

server.get('/', (req, res) => {
    res.send('Hello World!');
})

server.listen(port, async () => {
    await agent.isAlive();
    await agent.getAccountBalance('0x4E1bFC3E280e87ac03E49e7604b04CA37F91E5A1');
    console.log(`Example server listening on port ${port}`)
})