export interface Transaction {
  fromAddress: string | null;
  toAddress: string;
  amount: number;
}

export interface Block {
  timestamp: number;
  transactions: Transaction[];
  previousHash: string;
  hash: string;
  nonce: number;
}
