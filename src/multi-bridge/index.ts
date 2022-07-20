import BigNumber from "bignumber.js";
import { ScVerifyRepo } from "../external/sc-verify";
import { ChainInfo } from "./chain-info";
import { ChainNonces } from "./meta";
import {
  InferBridgeChain,
  InferChainMeta,
  InferParams,
  InferSigner,
} from "./type-utils";

export type Erc20MultiBridge = {
  inner<T extends ChainNonces>(nonce: T): Promise<InferBridgeChain<T>>;

  tokenBalance<T extends ChainNonces>(
    nonce: T,
    token: string,
    addr: string
  ): Promise<BigNumber>;

  estimateFees<R extends ChainNonces>(
    sourceNonce: number,
    token: string,
    targetNonce: R
  ): Promise<BigNumber>;

  preTransfer<T extends ChainNonces>(
    nonce: T,
    sender: InferSigner<T>,
    token: string,
    amt: BigNumber
  ): Promise<string | undefined>;

  transferTokens<T extends ChainNonces, R extends ChainNonces>(
    nonce: T,
    sender: InferSigner<T>,
    token: string,
    chainNonce: R,
    amt: BigNumber,
    txFee?: BigNumber
  ): Promise<string>;
};

export type MultiBridgeParams = Partial<{
  [K in ChainNonces]: InferParams<K>;
}>;

export type MultiBridgeDeps = {
  scVerify: ScVerifyRepo;
};

export function erc20MultiBridge(
  p: MultiBridgeParams,
  d: MultiBridgeDeps
): Erc20MultiBridge {
  let chainCache: Partial<{
    [K in ChainNonces]: InferChainMeta<K>;
  }> = {};

  function inner<T extends ChainNonces>(nonce: T): InferChainMeta<T> {
    const cachedChain: InferChainMeta<T> | undefined = chainCache[nonce];
    if (cachedChain) return cachedChain!;

    const chainParams = p[nonce];
    if (!chainParams) throw Error("chain not enabled!");

    const chain = ChainInfo[nonce].factory(chainParams!);

    return chain as InferChainMeta<T>;
  }

  async function isWrappedToken(chainNonce: number, token: string) {
    const res = await d.scVerify.getTokenPairByWrapped(chainNonce, token);
    return res != undefined;
  }

  const estimateFees: Erc20MultiBridge["estimateFees"] = async (
    sn,
    token,
    tn
  ) => {
    const [chain, mapper] = inner(tn);
    let estimator;
    if (await isWrappedToken(sn, token)) {
      estimator = chain.estimateTransferWrapped;
    } else {
      estimator = chain.estimateTransferNative;
    }

    return mapper.bigNumToDomain(await estimator());
  };

  return {
    inner: <T extends ChainNonces>(n: T) => Promise.resolve(inner(n)[0]),
    tokenBalance: async (n, token, addr) => {
      const [chain, mapper] = inner(n);
      return mapper.bigNumToDomain(
        await chain.tokenBalance(mapper.tokenFromDomain(token), addr)
      );
    },
    estimateFees,
    async preTransfer(n, s, t, a) {
      if (await isWrappedToken(n, t)) return undefined;

      const [chain, mapper] = inner(n);
      const token = mapper.tokenFromDomain(t);

      const res = await chain.preTransfer(s, token, mapper.bigNumFromDomain(a));
      if (!res) return undefined;

      return mapper.txnToDomain(res!);
    },
    async transferTokens(n, s, t, cn, a, tf) {
      const [chain, mapper] = inner(n);
      const txFee = tf || (await estimateFees(n, t, cn));

      let res;
      if (await isWrappedToken(n, t)) {
        res = chain.transferWrapped(
          s,
          mapper.tokenFromDomain(t),
          cn,
          mapper.bigNumFromDomain(a),
          mapper.bigNumFromDomain(txFee)
        );
      } else {
        res = chain.transferNative(
          s,
          mapper.tokenFromDomain(t),
          cn,
          mapper.bigNumFromDomain(a),
          mapper.bigNumFromDomain(txFee)
        );
      }

      return mapper.txnToDomain(await res);
    },
  };
}
