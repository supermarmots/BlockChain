# 🔗 블록체인 학습 프로젝트

JavaScript/TypeScript로 구현한 교육용 블록체인 시스템입니다. 블록체인의 핵심 개념인 해시, 트랜잭션, 채굴, 그리고 분산원장을 직접 체험할 수 있습니다.

## 📚 블록체인이란?

블록체인은 **분산된 디지털 원장 기술**로, 거래 정보를 블록 단위로 체인처럼 연결하여 저장하는 기술입니다.

### 🔍 주요 개념

#### 1. 블록 (Block)

- **타임스탬프**: 블록이 생성된 시간
- **트랜잭션**: 실제 거래 데이터들
- **이전 해시**: 이전 블록의 해시값 (체인 연결)
- **해시**: 현재 블록의 고유 식별자
- **논스(Nonce)**: 채굴 과정에서 사용되는 숫자

#### 2. 트랜잭션 (Transaction)

```javascript
{
  fromAddress: "Alice",    // 보내는 사람
  toAddress: "Bob",        // 받는 사람
  amount: 50               // 금액
}
```

#### 3. 해시 (Hash)

- SHA256 암호화 함수를 사용
- 블록의 내용이 조금이라도 바뀌면 완전히 다른 해시값 생성
- 블록체인의 **무결성**을 보장하는 핵심 기술

#### 4. 채굴 (Mining)

- 새로운 블록을 블록체인에 추가하는 과정
- **작업증명(Proof of Work)**: 특정 조건을 만족하는 해시를 찾는 과정
- 채굴자는 성공 시 보상을 받음 (현재 설정: 100코인)

## 🏗️ 프로젝트 구조

```
blockchain/
├── server/          # Node.js 백엔드 (블록체인 로직)
│   ├── blockchain.js    # 블록체인 핵심 클래스들
│   ├── main.js         # Express API 서버
│   └── package.json
└── client/          # React 프론트엔드 (사용자 인터페이스)
    ├── src/
    │   ├── App.tsx     # 메인 컴포넌트
    │   └── types.ts    # TypeScript 타입 정의
    └── package.json
```

## 🚀 설치 및 실행

### 1. 저장소 클론

```bash
git clone https://github.com/supermarmots/BlockChanin.git
cd BlockChanin
```

### 2. 서버 실행

```bash
cd server
npm install
node main.js
```

서버가 `http://localhost:4000`에서 실행됩니다.

### 3. 클라이언트 실행 (새 터미널)

```bash
cd client
npm install
npm run dev
```

클라이언트가 `http://localhost:5173`에서 실행됩니다.

## 🎮 사용법

### 1. 웹 인터페이스 접속

브라우저에서 `http://localhost:5173`에 접속하세요.

### 2. 트랜잭션 생성

- **보내는 주소**: 송금자의 주소 (예: "Alice")
- **받는 주소**: 수신자의 주소 (예: "Bob")
- **금액**: 송금할 코인 수량

### 3. 채굴 실행

- **채굴자 주소**: 채굴 보상을 받을 주소
- 채굴 버튼 클릭 시 대기 중인 모든 트랜잭션이 새 블록에 포함됩니다

### 4. 블록체인 확인

페이지 하단에서 전체 블록체인의 상태를 실시간으로 확인할 수 있습니다.

## 🔧 API 엔드포인트

### GET `/blocks`

전체 블록체인 조회

```json
[
  {
    "timestamp": 1633024800000,
    "transactions": [...],
    "previousHash": "0",
    "hash": "00ab123...",
    "nonce": 12345
  }
]
```

### GET `/balance/:address`

특정 주소의 잔액 조회

```json
{
  "address": "Alice",
  "balance": 150
}
```

### POST `/transactions`

새 트랜잭션 생성

```json
{
  "fromAddress": "Alice",
  "toAddress": "Bob",
  "amount": 50
}
```

### POST `/mine`

채굴 실행

```json
{
  "minerAddress": "Alice"
}
```

## 🧪 블록체인 실험해보기

### 실험 1: 첫 번째 거래

1. 채굴자 주소에 "Miner1" 입력 후 채굴 → 100코인 보상 획득
2. 트랜잭션: Miner1 → Alice (50코인)
3. 다시 채굴하여 트랜잭션을 블록에 포함

### 실험 2: 잔액 부족 상황

1. Alice → Bob (100코인) 시도
2. 서버 콘솔에서 "잔액 부족" 메시지 확인

### 실험 3: 블록체인 무결성 확인

개발자 도구에서 다음 코드 실행:

```javascript
// 브라우저 콘솔에서 실행
fetch("http://localhost:4000/blocks")
  .then((res) => res.json())
  .then((chain) => {
    console.log("블록체인 길이:", chain.length);
    console.log("각 블록의 해시 연결 확인");
    for (let i = 1; i < chain.length; i++) {
      console.log(
        `블록 ${i}: ${
          chain[i].previousHash === chain[i - 1].hash ? "✅" : "❌"
        }`
      );
    }
  });
```

## 🔬 블록체인의 특징 이해하기

### 1. 불변성 (Immutability)

- 한번 기록된 블록은 수정이 매우 어려움
- 해시 체인으로 연결되어 이전 블록 변경 시 모든 후속 블록 무효화

### 2. 투명성 (Transparency)

- 모든 거래 내역이 공개적으로 조회 가능
- 하지만 실제 개인정보는 주소로 익명화

### 3. 탈중앙화 (Decentralization)

- 단일 서버가 아닌 여러 노드에 분산 저장
- (이 프로젝트는 교육용으로 단일 노드)

### 4. 합의 메커니즘 (Consensus)

- 작업증명(PoW)을 통한 블록 검증
- 가장 긴 체인이 유효한 체인으로 인정

## 🛠️ 기술 스택

- **백엔드**: Node.js, Express.js
- **프론트엔드**: React, TypeScript, Vite
- **암호화**: crypto-js (SHA256)
- **통신**: REST API, CORS

## 📖 학습 포인트

1. **해시 함수의 역할**: 데이터 무결성 보장
2. **체인 구조**: 블록들이 어떻게 연결되는가
3. **채굴 과정**: 작업증명의 실제 구현
4. **트랜잭션 검증**: 잔액 확인 및 유효성 검사
5. **분산원장**: 모든 참여자가 동일한 장부 공유

## 🔗 참고 자료

- [블록체인 기술 개요](https://ko.wikipedia.org/wiki/%EB%B8%94%EB%A1%9D%EC%B2%B4%EC%9D%B8)
- [암호화 해시 함수](https://ko.wikipedia.org/wiki/SHA-2)
- [작업증명](https://ko.wikipedia.org/wiki/%EC%9E%91%EC%97%85_%EC%A6%9D%EB%AA%85)

---

💡 **팁**: 이 프로젝트는 실제 암호화폐가 아닌 교육용 시뮬레이션입니다. 블록체인의 기본 개념을 이해하는데 활용하세요!
