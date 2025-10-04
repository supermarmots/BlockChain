const SHA256 = require("crypto-js/sha256");

class Block {
  constructor(index, timestamp, data, previousHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(
      this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce
    ).toString();
  }

  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log(`블록 채굴 완료: ${this.hash}`);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4;
  }

  createGenesisBlock() {
    return new Block(0, Date.now(), "Genesis Block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

// --- 실행 코드 ---

const myBlockchain = new Blockchain();

console.log("첫 번째 블록 채굴 중...");
myBlockchain.addBlock(new Block(1, Date.now(), { amount: 4 }));

console.log("두 번째 블록 채굴 중...");
myBlockchain.addBlock(new Block(2, Date.now(), { amount: 10 }));

console.log(JSON.stringify(myBlockchain, null, 4));

console.log(`\n블록체인 유효성: ${myBlockchain.isChainValid()}`);

console.log("\n데이터 위변조 시도...");
myBlockchain.chain[1].data = { amount: 100 };
myBlockchain.chain[1].hash = myBlockchain.chain[1].calculateHash();

console.log(`데이터 변경 후 블록체인 유효성: ${myBlockchain.isChainValid()}`);
