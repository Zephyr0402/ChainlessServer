import * as IPFS from 'ipfs';
import fs from 'fs';

function readImageFile(path) {
  return fs.readFileSync(path);
}

class IpfsStorage {
  constructor() {
    this.node = null;
  }

  async start() {
    this.node = await IPFS.create();
  }

  async stop() {
    await this.node.stop();
  }

  async addData(data) {
    const fileToAdd = { content: data };
    const addedFile = await this.node.add(fileToAdd);
    return addedFile.cid.toString();
  }

  async getData(cid) {
    const fileBuffer = [];
    for await (const chunk of this.node.cat(cid)) {
      fileBuffer.push(chunk);
    }
    return Buffer.concat(fileBuffer);
  }

  async unpinData(cid) {
    await this.node.pin.rm(cid);
  }
}

(async () => {
  try {
    const ipfsStorage = new IpfsStorage();
    await ipfsStorage.start();
    const imageBuffer = readImageFile('/Users/Bevis/Downloads/aws.jpg');
    const cid = await ipfsStorage.addData(imageBuffer);
    const imageData = await ipfsStorage.getData(cid);
    console.log(cid);
    fs.writeFileSync('output.jpg', imageData);
    //await ipfsStorage.unpinData(cid);
    //await ipfsStorage.stop();
  } catch (err) {
    console.error(err);
  }
})();
