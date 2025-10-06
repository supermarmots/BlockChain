import { useState, useEffect } from "react";
import { type Block } from "./types";
import "./App.css";

const API_URL = "http://localhost:4000";

function App() {
  const [chain, setChain] = useState<Block[]>([]);
  const [fromAddress, setFromAddress] = useState<string>("");
  const [toAddress, setToAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [minerAddress, setMinerAddress] = useState<string>("");

  const fetchChain = async () => {
    try {
      const response = await fetch(`${API_URL}/blocks`);
      const data: Block[] = await response.json();
      setChain(data);
    } catch (error) {
      console.error("블록체인 데이터 가져오기 실패:", error);
    }
  };

  useEffect(() => {
    fetchChain();
  }, []);

  const handleTransactionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromAddress,
          toAddress,
          amount: Number(amount),
        }),
      });
      alert("트랜잭션 생성 성공!");
      setFromAddress("");
      setToAddress("");
      setAmount("");
    } catch (error) {
      console.error("트랜잭션 생성 실패: ", error);
      alert("트랜잭션 생성 실패!");
    }
  };

  const handleMine = async () => {
    if (!minerAddress) {
      alert("채굴자의 주소를 입력해주세요.");
      return;
    }
    try {
      await fetch(`${API_URL}/mine`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ minerAddress }),
      });
      alert("새로운 블록 채굴 성공!");
      setMinerAddress("");
      fetchChain();
    } catch (error) {
      console.error("채굴 실패: ", error);
      alert("채굴 실패!");
    }
  };

  return (
    <div className="container">
      <h1>간단한 블록체인 클라이언트</h1>

      <div className="form-card">
        <h2>새로운 트랜잭션 생성</h2>
        <form onSubmit={handleTransactionSubmit}>
          <div className="form-group">
            <label>보내는 주소 (From)</label>
            <input
              value={fromAddress}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFromAddress(e.target.value)
              }
              required
            />
          </div>
          <div className="form-group">
            <label>받는 주소 (To)</label>
            <input
              value={toAddress}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setToAddress(e.target.value)
              }
              required
            />
          </div>
          <div className="form-group">
            <label>금액 (amount)</label>
            <input
              type="number"
              value={amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setAmount(e.target.value)
              }
              required
            />
          </div>
          <button type="submit">트랜잭션 생성</button>
        </form>
      </div>

      <div className="form-card">
        <h2>채굴 실행</h2>
        <div className="form-group">
          <label>채굴자 주소</label>
          <input
            value={minerAddress}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setMinerAddress(e.target.value)
            }
            placeholder="채굴 보상 주소 입력"
            required
          />
        </div>
        <button onClick={handleMine}>채굴 실행</button>
      </div>

      <h2>전체 블록체인</h2>
      {chain.map((block, index) => (
        <div key={block.hash} className="block-card">
          <h3>Block #{index}</h3>
          <p>
            <strong>Timestamp:</strong>{" "}
            {new Date(block.timestamp).toLocaleString()}
          </p>
          <p>
            <strong>Previous Hash:</strong> {block.previousHash}
          </p>
          <p>
            <strong>Hash:</strong> {block.hash}
          </p>
          <h4>Transactions:</h4>
          {block.transactions.map((tx, txIndex) => (
            <div key={txIndex} className="transaction">
              <p>
                <strong>From:</strong> {tx.fromAddress || "시스템 (보상)"}
              </p>
              <p>
                <strong>To:</strong> {tx.toAddress}
              </p>
              <p>
                <strong>Amount:</strong> {tx.amount}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;
