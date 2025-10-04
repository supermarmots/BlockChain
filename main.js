const express = require("express");
const app = express();
const port = 4000;

const { Blockchain, Transaction } = require("./blockchain");
const myCoin = new Blockchain();

// POST 요청의 body를 json으로 파싱하기 위한 미들웨어
app.use(express.json());

// API 1: 전체 블록체인 조회
app.get("/blocks", (req, res) => {
  res.json(myCoin.chain);
});

// API 2: 특정 주소의 잔액 조회
app.get("/balance/:address", (req, res) => {
  const address = req.params.address;
  const balance = myCoin.getBalanceOfAddress(address);
  res.json({ address: address, balance: balance });
});

// API 3: 새로운 트랜잭션 생성
app.post("/transactions", (req, res) => {
  const { fromAddress, toAddress, amount } = req.body;
  if (!fromAddress || !toAddress || !amount) {
    return res.status(400).send("fromAddress, toAddress, amount는 필수입니다.");
  }

  const newTransaction = new Transaction(fromAddress, toAddress, amount);
  myCoin.createTransaction(newTransaction);

  res.send(
    "트랜잭션이 성공적으로 추가되었습니다. 다음 블록에 포함될 예정입니다."
  );
});

// API 4: 채굴 실행
app.post("/mine", (req, res) => {
  const { minerAddress } = req.body;
  if (!minerAddress) {
    return res.status(400).send("채굴자의 주소(minerAddress)는 필수입니다.");
  }

  myCoin.minePendingTransactions(minerAddress);
  res.send("새로운 블록이 성공적으로 채굴되었습니다!");
});

// 서버 실행
app.listen(port, () => {
  console.log(
    `블록체인 API 서버가 http://localhost:${port} 에서 실행 중입니다...`
  );
});
