import { FullBridgeChain } from "..";
import algosdk from "algosdk";

type AlgoSigenr = algosdk.Account;

export type AlgoBridgeChain = FullBridgeChain<
  AlgoSigenr,
  number,
  bigint,
  string,
  algosdk.Address
>;

export type AlgoParams = {
  algod: algosdk.Algodv2;
  indexer: algosdk.Indexer;
  bridgeId: number;
};

// TODO
const TRANSFER_NATIVE_COST = BigInt(1);
// TODO
const TRANSFER_WRAPPED_COST = BigInt(1);

const enc = new TextEncoder();

export function algoBridgeChain(p: AlgoParams): AlgoBridgeChain {
  function isOptedByBridge(assetId: number) {
    return p.indexer
      .lookupAccountAssets(algosdk.getApplicationAddress(p.bridgeId))
      .assetId(assetId)
      .do()
      .then(() => true)
      .catch((err) => {
        console.log("error", err);
        return false;
      });
  }

  return {
    async tokenBalance(token, address) {
      const res = await p.indexer
        .lookupAccountAssets(algosdk.encodeAddress(address.publicKey))
        .assetId(token)
        .do()
        .catch(() => ({ assets: [{ amount: 0 }] }));
      return BigInt(res.assets[0].amount);
    },
    estimateTransferNative() {
      return Promise.resolve(TRANSFER_NATIVE_COST);
    },
    estimateTransferWrapped() {
      return Promise.resolve(TRANSFER_WRAPPED_COST);
    },
    async preTransfer() {
      // TODO
      return undefined;
    },
    async transferNative(sender, nativeToken, chainNonce, amt, to, txFee) {
      const params = await p.algod.getTransactionParams().do();

      let txns: algosdk.Transaction[] = [];

      if (!(await isOptedByBridge(nativeToken))) {
        const optInAsaTxn = algosdk.makeApplicationNoOpTxnFromObject({
          from: sender.addr,
          suggestedParams: params,
          appIndex: p.bridgeId,
          appArgs: [enc.encode("optin_asa")],
          foreignAssets: [nativeToken],
        });
        optInAsaTxn.amount = 100000;
        optInAsaTxn.fee = 2000;
        txns.push(optInAsaTxn);
      }

      const asaTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: sender.addr,
        suggestedParams: params,
        to: algosdk.getApplicationAddress(p.bridgeId),
        amount: amt,
        assetIndex: nativeToken,
      });
      const payTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: sender.addr,
        suggestedParams: params,
        to: algosdk.getApplicationAddress(p.bridgeId),
        amount: txFee,
      });
      const callTxn = algosdk.makeApplicationNoOpTxnFromObject({
        from: sender.addr,
        suggestedParams: params,
        appIndex: p.bridgeId,
        appArgs: [
          enc.encode("send_native"),
          algosdk.encodeUint64(amt),
          algosdk.encodeUint64(chainNonce),
          enc.encode(to),
        ],
      });
      txns.push(asaTxn, payTxn, callTxn);

      algosdk.assignGroupID(txns);

      const sTxns = txns.map((t) => t.signTxn(sender.sk));

      await p.algod.sendRawTransaction(sTxns).do();

      return callTxn.txID();
    },
    async transferWrapped(sender, wToken, chainNonce, amt, to, txFee) {
      const params = await p.algod.getTransactionParams().do();

      const asaTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: sender.addr,
        suggestedParams: params,
        to: algosdk.getApplicationAddress(p.bridgeId),
        amount: amt,
        assetIndex: wToken,
      });
      const payTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: sender.addr,
        suggestedParams: params,
        to: algosdk.getApplicationAddress(p.bridgeId),
        amount: txFee,
      });

      const callTxn = algosdk.makeApplicationNoOpTxnFromObject({
        from: sender.addr,
        suggestedParams: params,
        appIndex: p.bridgeId,
        appArgs: [
          enc.encode("send_wrapped"),
          algosdk.encodeUint64(amt),
          algosdk.encodeUint64(chainNonce),
          enc.encode(to),
        ],
      });

      algosdk.assignGroupID([asaTxn, payTxn, callTxn]);

      const sTxns = [asaTxn, payTxn, callTxn].map((t) => t.signTxn(sender.sk));

      await p.algod.sendRawTransaction(sTxns).do();

      return callTxn.txID();
    },
  };
}
