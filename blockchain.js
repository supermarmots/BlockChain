const SHA256 = require("crypto-js/sha256");

class Block {
  constructor(timestamp, transactions, previousHash = "") {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(
      this.previousHash +
        this.timestamp +
        JSON.stringify(this.transactions) +
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
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.minigReward = 100;
  }

  createGenesisBlock() {
    return new Block(Date.now(), [], "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(miningRewardAddress) {
    const rewardTx = new Transaction(
      null,
      miningRewardAddress,
      this.minigReward
    );
    this.pendingTransactions.push(rewardTx);

    const block = new Block(
      Date.now(),
      this.pendingTransactions,
      this.getLatestBlock().hash
    );
    block.mineBlock(this.difficulty);

    console.log(`블록 채굴 성공: ${block.hash}`);
    this.chain.push(block);

    this.pendingTransactions = [];
  }

  // 새 트랜잭션 생성 후 대기 목록에 추가
  createTransaction(transaction) {
    // 유효성 검증 로직 추가
    if (!transaction.fromAddress || !transaction.toAddress) {
      console.log("거래에는 보내는 주소와 받는 주소가 모두 필요합니다.");
      return;
    }

    if (transaction.amount <= 0) {
      console.log("거래 금액은 0보다 커야 합니다.");
      return;
    }

    // 1. 보내는 사람의 현재 잔액을 확인합니다.
    const senderBalance = this.getBalanceOfAddress(transaction.fromAddress);

    // 2. 만약 잔액이 보내려는 금액보다 적으면 거래를 거부합니다.
    if (senderBalance < transaction.amount) {
      console.log("잔액 부족! 거래를 생성할 수 없습니다.");
      return;
    }

    // 3. 모든 검증을 통과하면 거래를 대기 목록에 추가합니다.
    this.pendingTransactions.push(transaction);
    console.log("거래가 성공적으로 생성되었습니다.");
  }

  // 특정 주소의 잔액 계산
  getBalanceOfAddress(address) {
    let balance = 0;
    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress === address) {
          balance -= trans.amount;
        }

        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }
    return balance;
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
    return false;
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

//트랜잭션
class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

// // --- 블록체인 기본 실행 코드 ---

// const myBlockchain = new Blockchain();

// console.log("첫 번째 블록 채굴 중...");
// myBlockchain.addBlock(new Block(1, Date.now(), { amount: 4 }));

// console.log("두 번째 블록 채굴 중...");
// myBlockchain.addBlock(new Block(2, Date.now(), { amount: 10 }));

// console.log(JSON.stringify(myBlockchain, null, 4));

// console.log(`\n블록체인 유효성: ${myBlockchain.isChainValid()}`);

// console.log("\n데이터 위변조 시도...");
// myBlockchain.chain[1].data = { amount: 100 };
// myBlockchain.chain[1].hash = myBlockchain.chain[1].calculateHash();

// console.log(`데이터 변경 후 블록체인 유효성: ${myBlockchain.isChainValid()}`);

// --- 블록체인 트랜젝션 실행 코드 ---

const myBlockchain = new Blockchain();

// 1. 거래 생성: '지갑1'이 '지갑2'에게 10 코인을 보냅니다.
console.log("거래 생성...");
myBlockchain.createTransaction(
  new Transaction("wallet-address-1", "wallet-address-2", 10)
);

// 2. 채굴 시작: 채굴자는 'my-wallet' 입니다.
// 이 시점에서 대기중이던 거래가 블록에 담기고, 채굴자는 보상을 받습니다.
console.log("\n채굴 시작...");
myBlockchain.minePendingTransactions("my-wallet");

// 3. 잔액 확인
// 'my-wallet'은 채굴 보상으로 100 코인을 얻었을 것입니다.
// 'wallet-address-1'은 10 코인을 보냈으므로 -10이 됩니다.
// 'wallet-address-2'은 10 코인을 받았으므로 10이 됩니다.
console.log(
  `\n'my-wallet'의 잔액: ${myBlockchain.getBalanceOfAddress("my-wallet")}`
);
console.log(
  `'wallet-address-1'의 잔액: ${myBlockchain.getBalanceOfAddress(
    "wallet-address-1"
  )}`
);
console.log(
  `'wallet-address-2'의 잔액: ${myBlockchain.getBalanceOfAddress(
    "wallet-address-2"
  )}`
);

// 4. 다시 채굴
// 새로운 거래가 없어도 채굴은 가능하며, 채굴자는 보상을 받습니다.
console.log("\n다시 채굴 시작...");
myBlockchain.minePendingTransactions("my-wallet");

// 5. 최종 잔액 확인
// 'my-wallet'은 채굴 보상을 한 번 더 받아 200 코인이 되었을 것입니다.
console.log(
  `\n'my-wallet'의 최종 잔액: ${myBlockchain.getBalanceOfAddress("my-wallet")}`
);

// 6. 블록체인 구조 및 유효성 확인
console.log("\n--- 전체 블록체인 구조 ---");
console.log(JSON.stringify(myBlockchain.chain, null, 4));
console.log(`\n블록체인 유효성: ${myBlockchain.isChainValid()}`);
