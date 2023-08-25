import * as IPFS from 'ipfs';
import fs from 'fs';

export class IpfsUtils {
  constructor() {
    this.node = null;
    this.metadataIndex = new Map();
  }

  readImageFile(path) {
    return fs.readFileSync(path);
  }

  async start(config = {}) {
    this.node = await IPFS.create(config);
  }

  async stop() {
    await this.node.stop();
  }

  async addData(data, metadata = {}) {
    const item = {
      data,
      metadata,
      timestamp: Date.now()
    };
    const addedFile = await this.node.add(JSON.stringify(item));
    const cid = addedFile.cid.toString();
    this.metadataIndex.set(cid, metadata);
    return cid;
  }

  async addMultipleData(items) {
    const cids = [];
    for (const item of items) {
      const cid = await this.addData(item.data, item.metadata);
      cids.push(cid);
    }
    return cids;
  }

  async getData(cid) {
    const fileBuffer = [];
    for await (const chunk of this.node.cat(cid)) {
      fileBuffer.push(chunk);
    }
    const item = JSON.parse(Buffer.concat(fileBuffer).toString());
    return item.data;
  }

  async getMultipleData(cids) {
    const results = [];
    for (const cid of cids) {
      const data = await this.getData(cid);
      results.push(data);
    }
    return results;
  }

  async updateData(oldCID, newData, newMetadata = {}) {
    const newCID = await this.addData(newData, newMetadata);
    this.metadataIndex.delete(oldCID);
    return newCID;
  }

  async unpinData(cid) {
    await this.node.pin.rm(cid);
    this.metadataIndex.delete(cid);
  }
}
