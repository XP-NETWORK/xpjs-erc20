import { Erc20TransferChecks, FullBridgeChain } from "..";
import algosdk from "algosdk";
import { AlgoSignerH, BrowserSigner } from "./signer";
import { Base64 } from "js-base64";

type AlgoUtils = {
  algoSignerWrapper: (acc: algosdk.Account) => AlgoSignerH;
};

export type AlgoBridgeChain = FullBridgeChain<
  AlgoSignerH,
  number,
  bigint,
  string,
  algosdk.Address
> &
  Erc20TransferChecks<number, algosdk.Address> &
  AlgoUtils;

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
  function isOptedByAddr(assetId: number, addr: string) {
    return p.indexer
      .lookupAccountAssets(addr)
      .assetId(assetId)
      .do()
      .then(() => true)
      .catch((err) => {
        console.log("error", err);
        return false;
      });
  }

  function isOptedByBridge(assetId: number) {
    return isOptedByAddr(assetId, algosdk.getApplicationAddress(p.bridgeId));
  }

  const preTransferCheck: AlgoBridgeChain["preReceiveForeignCheck"] = async (
    t,
    r
  ) => {
    const res = await isOptedByAddr(t, algosdk.encodeAddress(r.publicKey));
    return res ? undefined : `receiver must opt in to asset ${t}`;
  };

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
          from: sender.address,
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
        from: sender.address,
        suggestedParams: params,
        to: algosdk.getApplicationAddress(p.bridgeId),
        amount: amt,
        assetIndex: nativeToken,
      });
      const payTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: sender.address,
        suggestedParams: params,
        to: algosdk.getApplicationAddress(p.bridgeId),
        amount: txFee,
      });
      const callTxn = algosdk.makeApplicationNoOpTxnFromObject({
        from: sender.address,
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

      const sTxns = await sender.algoSigner.signTxn(
        txns.map((t) => ({ txn: Base64.fromUint8Array(t.toByte()) }))
      );

      await p.algod
        .sendRawTransaction(sTxns.map((s) => Base64.toUint8Array(s.blob)))
        .do();

      return callTxn.txID();
    },
    async transferWrapped(sender, wToken, chainNonce, amt, to, txFee) {
      const params = await p.algod.getTransactionParams().do();

      const asaTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: sender.address,
        suggestedParams: params,
        to: algosdk.getApplicationAddress(p.bridgeId),
        amount: amt,
        assetIndex: wToken,
      });
      const payTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: sender.address,
        suggestedParams: params,
        to: algosdk.getApplicationAddress(p.bridgeId),
        amount: txFee,
      });

      const callTxn = algosdk.makeApplicationNoOpTxnFromObject({
        from: sender.address,
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

      const sTxns = await sender.algoSigner.signTxn(
        [asaTxn, payTxn, callTxn].map((t) => ({
          txn: Base64.fromUint8Array(t.toByte()),
        }))
      );

      await p.algod
        .sendRawTransaction(sTxns.map((s) => Base64.toUint8Array(s.blob)))
        .do();

      return callTxn.txID();
    },
    preReceiveForeignCheck: preTransferCheck,
    preReceiveNativeCheck: preTransferCheck,
    algoSignerWrapper(acc): AlgoSignerH {
      const signer: BrowserSigner = {
        accounts(_) {
          return Promise.resolve([
            {
              address: acc.addr,
            },
          ]);
        },
        signTxn(txns) {
          return Promise.resolve(
            txns.map((t) => {
              const signed = algosdk.signTransaction(
                algosdk.decodeUnsignedTransaction(Base64.toUint8Array(t.txn)),
                acc.sk
              );
              return {
                txID: signed.txID,
                blob: Base64.fromUint8Array(signed.blob),
              };
            })
          );
        },
        send({ tx }) {
          return p.algod.sendRawTransaction(Base64.toUint8Array(tx)).do();
        },
      };

      return {
        algoSigner: signer,
        address: acc.addr,
        ledger: "any",
      };
    },
  };
}
