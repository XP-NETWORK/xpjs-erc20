import axios from "axios";
import { ChainNonce } from "../multi-bridge/meta";

export type EvNotifer = ReturnType<typeof evNotifier>;

export function evNotifier(url: string) {
  const api = axios.create({
    baseURL: url,
  });

  async function web3Notify(chainNonce: number, txHash: string) {
    api.post("/tx/web3", {
      chain_nonce: chainNonce,
      tx_hash: txHash,
    });
  }

  async function algorandNotify(txHash: string) {
    api.post("/tx/algorand", {
      tx_hash: txHash,
    });
  }

  return {
    async notifyValidator(fromChain: number, txHash: string) {
      switch (fromChain) {
        case ChainNonce.Algorand:
        case ChainNonce.AlgorandTestnet:
          await algorandNotify(txHash);
          break;
        default:
          await web3Notify(fromChain, txHash);
          break;
      }
    },
  };
}
